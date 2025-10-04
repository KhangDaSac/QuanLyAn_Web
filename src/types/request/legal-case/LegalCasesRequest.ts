import type { BatchRequest } from "../batch/BatchRequest";
import type { LegalCaseRequest } from "./LegalCaseRequest";

export interface LegalCasesRequest {
  legalCases: LegalCaseRequest[];
  batch: BatchRequest | null;
}