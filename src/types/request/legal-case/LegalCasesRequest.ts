import type { LegalCaseRequest } from "./LegalCaseRequest";

export interface LegalCasesRequest {
  legalCases: LegalCaseRequest[];
  batchId: string;
}