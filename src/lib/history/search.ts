import { CanonicalHistoryItem, CanonicalRecords } from "./CanonicalRecords";
import { normalizeUrl } from "./url";

const CHROME_EXTENSION_URL_PREFIX = "chrome-extension:";

export async function search(
  query: string,
  canonicalRecords: CanonicalRecords,
  max: number,
  callback: (results: CanonicalHistoryItem[]) => void
) {
  const items = await searchChromeHistory(query);
  const results: CanonicalHistoryItem[] = [];
  const resultUrls = new Set<string>();

  for (const item of items) {
    if (results.length >= max) {
      break;
    }
    if (
      !item.url ||
      item.url.startsWith(CHROME_EXTENSION_URL_PREFIX) ||
      // TODO(#257)
      !item.title
    ) {
      continue;
    }

    const normUrl = normalizeUrl(item.url);
    // Update the canonical record for the URL.
    canonicalRecords.updateFromHistoryItem(item, normUrl);
    // Get the updated canonical record.
    const record = canonicalRecords.getFromHistoryItem(item, normUrl);

    if (resultUrls.has(normUrl) || !record) {
      // already included this in the result
      continue;
    }

    results.push(record);
    resultUrls.add(normUrl);
  }

  return callback(results);
}

async function searchChromeHistory(
  query: string
): Promise<chrome.history.HistoryItem[]> {
  return await new Promise((resolve, reject) => {
    chrome.history.search({ text: query, startTime: 0 }, (historyItems) => {
      resolve(historyItems);
    });
  });
}
