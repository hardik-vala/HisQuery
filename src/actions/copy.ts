import { Result } from "../contexts/results/results";
import { Trigger, trackCopy } from "../lib/analytics/track";

export function copyResultUrl(
  result: Result,
  resultIndex: number,
  trigger: Trigger
) {
  navigator.clipboard.writeText(result.url.href);
  showToastOnWebPage(result);
  trackCopy(result, resultIndex, trigger);
}

function showToastOnWebPage(result: Result) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.id) {
      const message = result.title.length > 50 
        ? `'${result.title.substring(0, 50)}...'`
        : `${result.title}`;

      chrome.tabs.sendMessage(activeTab.id, {
        type: "showToast",
        payload: {
          message: `Copied ${message} to clipboard!`,
        },
      });
    }
  });
}