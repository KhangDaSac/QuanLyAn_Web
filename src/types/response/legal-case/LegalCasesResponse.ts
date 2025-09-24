import type { LegalCaseResponse } from './LegalCaseResponse';

export interface LegalCasesResponse {
  number: number;
  size: number;
  numberOfElement: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
  legalCases: LegalCaseResponse[];
}