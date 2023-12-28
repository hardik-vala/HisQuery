import {
  CanonicalHistoryItem,
  CanonicalRecords,
} from "./lib/history/CanonicalRecords";
import { search } from "./lib/history/search";

enum AppMessageType {
  GET_HISTORY = "getHistory",
  POPUP_OPENED = "popupOpened"
}

interface AppMessage {
  type: AppMessageType;
  payload: GetHistoryPayload | PopupOpenedPayload;
}

interface GetHistoryPayload {
  query: string;
}

interface PopupOpenedPayload {
  popupOpened: boolean;
  activeTabId: number | undefined;
}

const MAX_RESULTS = 10;
let RECORDS = new CanonicalRecords();

chrome.runtime.onMessage.addListener(
  (msg: AppMessage, sender, sendResponse) => {
    if (msg.type === "getHistory") {
      const payload = msg.payload as GetHistoryPayload;
      if (typeof payload.query !== undefined) {
        search(
          payload.query,
          RECORDS,
          MAX_RESULTS,
          (results: CanonicalHistoryItem[]) => sendResponse(results)
        );
      }
    } else if (msg.type === "popupOpened") {
      const payload = msg.payload as PopupOpenedPayload;
      if(payload.popupOpened && payload.activeTabId) {
        chrome.scripting.executeScript({
          target: { tabId: payload.activeTabId },
          files: ["js/contentScript.js"]
        });
      }
    }
    return true;
  }
);
