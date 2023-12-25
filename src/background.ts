import {
  CanonicalHistoryItem,
  CanonicalRecords,
} from "./lib/history/CanonicalRecords";
import { search } from "./lib/history/search";

enum AppMessageType {
  GET_HISTORY = "getHistory",
}

interface AppMessage {
  type: AppMessageType;
  payload: GetHistoryPayload;
}

interface GetHistoryPayload {
  query: string;
}

const MAX_RESULTS = 10;
let RECORDS = new CanonicalRecords();

chrome.runtime.onMessage.addListener(
  (msg: AppMessage, sender, sendResponse) => {
    if (msg.type === "getHistory" && typeof msg.payload.query !== undefined) {
      search(
        msg.payload.query,
        RECORDS,
        MAX_RESULTS,
        (results: CanonicalHistoryItem[]) => sendResponse(results)
      );
    }
    return true;
  }
);
