import { Result } from "../contexts/results/results";
import { Trigger, trackNavigate } from "../lib/analytics/track";

export function navigateToResultUrlInNewTab(
  result: Result,
  index: number,
  trigger: Trigger
) {
  trackNavigate(result, index, trigger);
  window.open(result.url.href, "_blank");
}
