import {
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  ListItem,
  Text,
  UnorderedList,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, {
  MouseEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BoxArrowUpRight, Clipboard } from "react-bootstrap-icons";
import { Result } from "../../contexts/results/results";
import { Trigger } from "../../lib/analytics/track";
import { friendlySince } from "../../lib/dateTime";
import { PIXELS_PER_INCREMENT } from "../../popup";

const DUMMY_RESULT: Result = {
  title: "<DUMMY_RESULT>",
  originalUrl: new URL("http://dummy.result.com"),
  url: new URL("http://dummy.result.com"),
  lastVisitTimeMs: -1
}

interface SearchResultsProps {
  activeIdx: number;
  results: Result[];
  onResultClick: (index: number) => void;
  onResultHover: (index: number) => void;
  onCopyButtonClick: (index: number, result: Result, trigger: Trigger) => void;
  topBuffer: number;
}
export function SearchResults(props: SearchResultsProps) {
  const {
    activeIdx,
    results,
    onResultClick,
    onResultHover,
    onCopyButtonClick,
    topBuffer,
  } = props;
  const resultRefs = useRef<React.RefObject<HTMLLIElement>[]>([]);
  const [pauseHover, setPauseHover] = useState(false);

  useEffect(() => {
    if (resultRefs.current[activeIdx]) {
      setPauseHover(true);
      resultRefs.current[activeIdx].current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIdx]);

  const onHover = useCallback(
    (index: number) => {
      if (!pauseHover) {
        onResultHover(index);
      } else {
        setPauseHover(false);
      }
    },
    [pauseHover, setPauseHover]
  );

  let resultsCopy: Result[];
  if (results.length !== 0) {
    resultsCopy = [...results];
  } else {
    // Insert dummy result if there are no search results so that downstream,
    // we can display the right message.
    // TODO(#253)
    resultsCopy = [DUMMY_RESULT];
  }

  return (
    <UnorderedList ml={0} pt={0}>
      {resultsCopy.map((result: Result, index: number) => {
        if (!resultRefs.current[index]) {
          resultRefs.current[index] = React.createRef<HTMLLIElement>();
        }
        return (
          <SearchResult
            active={index === activeIdx}
            key={`SearchResult-${index}`}
            result={result}
            onClick={() => onResultClick(index)}
            onHover={() => onResultHover(index)}
            onCopyClick={() => onCopyButtonClick(index, result, Trigger.CLICK)}
            ref={resultRefs.current[index]}
            topBuffer={index === 0 ? topBuffer : 0}
          />
        );
      })}
    </UnorderedList>
  );
}

const BASE_LI_PADDING = 4;
interface SearchResultProps {
  active: boolean;
  result: Result;
  onClick: () => void;
  onHover: () => void;
  onCopyClick: () => void;
  topBuffer: number;
}
const SearchResult = forwardRef<HTMLLIElement, SearchResultProps>(
  (props, ref) => {
    const { active, result, onClick, onHover, onCopyClick, topBuffer } = props;
    const activeBgColor = useColorModeValue("gray.300", "gray.900");
    const faviconUrl = getFaviconUrl(result.originalUrl ?? result.url);

    const copy = useCallback((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onCopyClick();
    }, []);

    if (result === DUMMY_RESULT) {
      return (
        <ListItem
          bg="transparent"
          listStyleType="none"
          ml={0}
          p={BASE_LI_PADDING}
          pt={
            topBuffer
              ? (topBuffer + BASE_LI_PADDING) * PIXELS_PER_INCREMENT
              : BASE_LI_PADDING
          }
          ref={ref}
        >
          <Text color="gray.100">
            No results
          </Text>
        </ListItem>
      );
    }

    return (
      <ListItem
        bg={active ? activeBgColor : "transparent"}
        cursor="pointer"
        listStyleType="none"
        ml={0}
        onClick={onClick}
        onMouseOver={onHover}
        p={BASE_LI_PADDING}
        pt={
          topBuffer
            ? (topBuffer + BASE_LI_PADDING) * PIXELS_PER_INCREMENT
            : BASE_LI_PADDING
        }
        ref={ref}
      >
        <Grid gap={2} templateColumns="repeat(11, 1fr)" alignItems="center">
          <GridItem colSpan={1}>
            <Image src={faviconUrl.toString()}/>
          </GridItem>
          <GridItem colSpan={8} overflow="hidden">
            <VStack gap={0} alignItems="flex-start">
              <Heading as="h4" size="xs" noOfLines={2}>
                {result.title}
              </Heading>
              <Text fontSize="xs" variant={"secondary"}>
                {result.url.hostname} •{" "}
                {friendlySince(new Date(result.lastVisitTimeMs), new Date())}
              </Text>
            </VStack>
          </GridItem>
          <GridItem colSpan={1} textAlign="center">
            <Button
              aria-label="Copy URL"
              onClick={copy}
              variant="ghost"
              p={2}
              size="lg"
            >
              <VStack gap={1}>
                <Clipboard />
                <Text fontSize="xs" variant={"secondary"}>
                  ⌘+c
                </Text>
              </VStack>
            </Button>
          </GridItem>
          <GridItem colSpan={1} textAlign="center">
            <Button aria-label="Navigate" variant="ghost" p={2} size="lg">
              <VStack gap={1}>
                <BoxArrowUpRight />
                <Text fontSize="xs" variant={"secondary"}>
                  enter
                </Text>
              </VStack>
            </Button>
          </GridItem>
        </Grid>
      </ListItem>
    );
  }
);

function getFaviconUrl(url: URL): URL {
  const faviconUrl = new URL(chrome.runtime.getURL("/_favicon/"));
  // This encodes the URL as well.
  faviconUrl.searchParams.set("pageUrl", url.toString());
  faviconUrl.searchParams.set("size", "16");
  return faviconUrl;
}
