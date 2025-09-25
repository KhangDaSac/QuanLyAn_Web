export interface PageResponse<T> {
  number: number;
  size: number;
  numberOfElement: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
  content: T[];
}