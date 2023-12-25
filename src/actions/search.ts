import { Dispatch } from "react";
import {
  ResultsReducerActions,
  ResultsReducerActionTypes,
} from "../contexts/results/results";
import { trackSearch } from "../lib/analytics/track";
import { CanonicalHistoryItem } from "../lib/history/CanonicalRecords";

export function search(
  query: string,
  dispatch: Dispatch<ResultsReducerActions>
) {
  chrome.runtime.sendMessage(
    { type: "getHistory", payload: { query } },
    function (response) {
      if (response) {
        const results = response.map((item: CanonicalHistoryItem) => {
          return {
            title: item.title,
            originalUrl: item.originalUrl
              ? new URL(item.originalUrl)
              : undefined,
            url: new URL(item.url),
            lastVisitTimeMs: item.lastVisitTime,
          };
        });
        dispatch({
          type: ResultsReducerActionTypes.SET,
          payload: results,
        });
        trackSearch(query, results);
      }
    }
  );
}
