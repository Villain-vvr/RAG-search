export interface DataItem {
  id: string;
  content: string;
  source?: string;
}

export interface SearchResult {
  items: DataItem[];
  summary: string;
}
