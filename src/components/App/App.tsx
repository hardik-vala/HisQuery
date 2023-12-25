import {
  Box,
  Container,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { copyResultUrl } from "../../actions/copy";
import { navigateToResultUrlInNewTab } from "../../actions/navigate";
import { search } from "../../actions/search";
import {
  Result,
  useResults,
  useResultsDispatch,
} from "../../contexts/results/results";
import { Trigger } from "../../lib/analytics/track";
import { BG_COLOR } from "../../popup";
import { SearchForm } from "../SearchForm/SearchForm";
import { SearchResults } from "../SearchResults/SearchResults";

const POST_COPY_WAIT_MS = 10;
const TOP_BUFFER = 61;
const TOP_BUFFER_IN_CHAKRA_INCREMENTS = Math.round(TOP_BUFFER / 4);

export default function App() {
  const [query, setQuery] = useState<string>("");
  // TODO(thehardikfactor): Fold this into ../../contexts/results/results.
  const [activeResultIndex, setActiveResultIndex] = useState<number>(0);
  const results = useResults().results;
  const resultsDispatch = useResultsDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  useEffect(() => {
    if (colorMode !== "dark") toggleColorMode();
  }, [colorMode]);
  const bgColor = useColorModeValue(BG_COLOR.light, BG_COLOR.dark);

  useEffect(() => {
    search(query, resultsDispatch);
    setActiveResultIndex(0);
  }, [query]);

  const handleInputChange = useCallback(
    (newQuery: string) => setQuery(newQuery),
    [setQuery]
  );

  const handleResultClick = useCallback(
    (index: number) => {
      setActiveResultIndex(index);
      if (results[index]) {
        navigateToResultUrlInNewTab(results[index], index, Trigger.CLICK);
      }
    },
    [results, setActiveResultIndex]
  );

  const handleResultHover = useCallback(
    (index: number) => {
      setActiveResultIndex(index);
    },
    [setActiveResultIndex]
  );

  const handleCopy = useCallback(
    (index: number, result: Result, trigger: Trigger) => {
      copyResultUrl(result, index, trigger);
      // defer window close to next event loop in order to allow copy to complete
      setTimeout(() => window.close(), POST_COPY_WAIT_MS);
    },
    []
  );

  // Keyboard event handler to handle arrow key presses.
  const handleKeys = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          setActiveResultIndex(Math.max(activeResultIndex - 1, 0));
          break;
        case "ArrowDown":
          event.preventDefault();
          setActiveResultIndex(
            Math.min(activeResultIndex + 1, results.length - 1)
          );
          break;
        case "c":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            if (results[activeResultIndex]) {
              handleCopy(
                activeResultIndex,
                results[activeResultIndex],
                Trigger.HOTKEY
              );
            }
          }
          break;
        case "Enter": // Capture 'Enter' key
          event.preventDefault();
          // If a valid result exists
          if (results[activeResultIndex]) {
            navigateToResultUrlInNewTab(
              results[activeResultIndex],
              activeResultIndex,
              Trigger.HOTKEY
            );
          }
          break;
        default:
          break;
      }
    },
    [activeResultIndex, results, setActiveResultIndex]
  );

  return (
    <Container
      bg={bgColor}
      color="chakra-body-text._dark"
      minHeight={TOP_BUFFER}
      p={0}
      width="700px"
      onKeyDown={handleKeys}
    >
      <Box
        bg={bgColor}
        position="fixed"
        left="0"
        right="0"
        top="0"
        height={TOP_BUFFER}
        zIndex={2}
      >
        <SearchForm query={query} onChange={handleInputChange} />
      </Box>
      <Box>
        <SearchResults
          activeIdx={activeResultIndex}
          results={results}
          onResultClick={handleResultClick}
          onResultHover={handleResultHover}
          onCopyButtonClick={handleCopy}
          topBuffer={TOP_BUFFER_IN_CHAKRA_INCREMENTS}
        />
      </Box>
    </Container>
  );
}
