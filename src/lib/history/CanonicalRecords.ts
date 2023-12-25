import { normalizeUrl } from "./url";

type HistoryItem = chrome.history.HistoryItem;
export type CanonicalHistoryItem = chrome.history.HistoryItem &
  Required<Pick<HistoryItem, "typedCount" | "url" | "visitCount">> & {
    originalUrl: string | undefined;
  };

export class CanonicalRecords {
  private MAX_BOOTSTRAP_HISTORY = 10000;
  private canonicalRecords: { [key: string]: CanonicalHistoryItem } = {};

  constructor() {
    this.bootstrap();
  }

  updateFromHistoryItem(item: HistoryItem, normalizedUrl: string): void {
    const record = this.canonicalRecords[normalizedUrl];
    if (record) {
      this.updateRecordFromHistoryItem(record, item);
    } else {
      this.canonicalRecords[normalizedUrl] =
        this.convertHistoryItemToCanonicalRecord(item, normalizedUrl);
    }
  }

  getFromHistoryItem(
    item: HistoryItem,
    normalizedUrl: string
  ): CanonicalHistoryItem | undefined {
    return this.canonicalRecords[normalizedUrl];
  }

  // NOTE: Chrome only gives you history up to the last 24 hours with an empty
  // search
  // TODO: more intelligent bootstrapping (prefetch common domains, etc)
  private async bootstrap() {
    let itemsProcessed = 0;
    let endTime = (new Date() as unknown as number) / 1 - 24 * 60 * 60 * 1000;
    let exhaustedHistory = false;
    while (itemsProcessed < this.MAX_BOOTSTRAP_HISTORY && !exhaustedHistory) {
      const items = await this.getHistoryBatch(endTime);

      let minVisitTime = endTime - 1;
      itemsProcessed = itemsProcessed + items.length;
      if (items.length < 1) exhaustedHistory = true;

      for (const item of items) {
        if (item.lastVisitTime && item.lastVisitTime < minVisitTime) {
          minVisitTime = item.lastVisitTime;
        }
        if (!item.url) {
          continue;
        }

        const normUrl = normalizeUrl(item.url ?? "");
        this.updateFromHistoryItem(item, normUrl);
      }
      endTime = minVisitTime;
    }
  }

  private async getHistoryBatch(endTime: number): Promise<HistoryItem[]> {
    return await new Promise((resolve, reject) => {
      chrome.history.search(
        { text: "", maxResults: 1000, endTime },
        (items: HistoryItem[]) => resolve(items)
      );
    });
  }

  private convertHistoryItemToCanonicalRecord(
    item: HistoryItem,
    normalizedUrl: string
  ): CanonicalHistoryItem {
    return {
      ...item,
      typedCount: item.typedCount ?? 0,
      originalUrl: item.url,
      url: normalizedUrl,
      visitCount: item.visitCount ?? 1,
    };
  }

  private updateRecordFromHistoryItem(
    record: CanonicalHistoryItem,
    item: HistoryItem
  ) {
    record.typedCount = record.typedCount + (item.typedCount ?? 0);
    record.visitCount = record.visitCount + (item.visitCount ?? 0);
    if (
      item.lastVisitTime &&
      (!record.lastVisitTime || item.lastVisitTime > record.lastVisitTime)
    ) {
      // The title of the latest history item is likely to be the most stable
      // one.
      record.title = item.title ?? record.title;
      record.lastVisitTime = item.lastVisitTime;
    }
  }
}
