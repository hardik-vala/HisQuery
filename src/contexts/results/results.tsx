import React, {
  Context,
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";

export interface ResultsContextContent {
  results: Result[];
}
export interface Result {
  title: string;
  originalUrl: URL | undefined;
  url: URL;
  lastVisitTimeMs: number;
}

const ResultsContext = createContext<ResultsContextContent>({
  results: [],
});
const ResultsDispatchContext: Context<Dispatch<ResultsReducerActions>> =
  createContext((value: ResultsReducerActions) => {});

export const ResultsContextProvider = (props: PropsWithChildren<{}>) => {
  const [results, dispatch] = useReducer(resultsReducer, initialResults);

  return (
    <ResultsContext.Provider value={{ results }}>
      <ResultsDispatchContext.Provider value={dispatch}>
        {props.children}
      </ResultsDispatchContext.Provider>
    </ResultsContext.Provider>
  );
};

export function useResults() {
  return useContext(ResultsContext);
}

export function useResultsDispatch() {
  return useContext(ResultsDispatchContext);
}

export enum ResultsReducerActionTypes {
  SET = "results_SET",
}

export type ResultsReducerActions = {
  type: ResultsReducerActionTypes.SET;
  payload: Result[];
};

function resultsReducer(results: Result[], action: ResultsReducerActions) {
  switch (action.type) {
    case ResultsReducerActionTypes.SET: {
      return action.payload;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialResults: Result[] = [];
