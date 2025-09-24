import type { LegalCaseResponse } from './LegalCaseResponse';

export interface LegalCasesResponse {
  number: number;
  size: number;
  numberOfElement: number;
  totalElements: number; // Tổng số phần tử trong toàn bộ dataset
  totalPages: number; // Tổng số trang
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
  legalCases: LegalCaseResponse[];
}