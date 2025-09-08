import type { LegalCaseRequest } from "./LegalCaseRequest";
import type { BatchRequest } from "../batch/BatchRequest";

export interface LegalCasesRequest {
  legalCases: LegalCaseRequest[];
  batch: BatchRequest;
}