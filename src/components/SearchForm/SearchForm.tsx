import React, { ChangeEvent } from "react";
import { Search } from "react-bootstrap-icons";
import {
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

export interface SearchFormProps {
  onChange: (query: string) => void;
  query: string;
}

export function SearchForm(props: SearchFormProps) {
  return (
    <FormControl>
      <InputGroup>
        <InputLeftElement
          pt={5}
          pointerEvents="none"
          color="gray.300"
          fontSize="1.2em"
        >
          <Search />
        </InputLeftElement>
        <Input
          autoComplete="off"
          autoFocus
          m={0}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            props.onChange(e.target.value)
          }
          placeholder="Search"
          pb={7}
          pt={8}
          value={props.query}
          variant="flushed"
        />
      </InputGroup>
    </FormControl>
  );
}
