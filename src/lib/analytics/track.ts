import posthog from "posthog-js";
import { Result } from "../../contexts/results/results";
import { normalizeUrl } from "../history/url";

enum AnalyticsEvent {
  COPY = "Copy",
  NAVIGATE = "Navigate",
  OPEN = "Open",
  SEARCH = "Search",
}

export enum Trigger {
  CLICK = "Click",
  HOTKEY = "Hotkey",
}

export function trackCopy(
  result: Result,
  resultIndex: number,
  trigger: Trigger
) {
  trackActionResult(AnalyticsEvent.COPY, result, resultIndex, trigger);
}

export function trackNavigate(
  result: Result,
  resultIndex: number,
  trigger: Trigger
) {
  trackActionResult(AnalyticsEvent.NAVIGATE, result, resultIndex, trigger);
}

export function trackOpen() {
  posthog.capture(AnalyticsEvent.OPEN);
}

export function trackSearch(query: string, results: Result[]) {
  posthog.capture(AnalyticsEvent.SEARCH, {
    query: process.env.NODE_ENV === "production" ? undefined : query,
    queryLength: query.length,
    resultsCount: results.length,
  });
}

/** PRIVATE */

function trackActionResult(
  event: AnalyticsEvent,
  result: Result,
  resultIndex: number,
  trigger: Trigger
) {
  const properties: { [key: string]: number | string } = {
    resultDomain: result.url.hostname,
    resultRank: resultIndex + 1,
    resultUrl: result.url.href,
    trigger,
  };
  if (process.env.NODE_ENV !== "production") {
    properties.resultTitle = result.title;
  }

  posthog.capture(event, properties);
}
