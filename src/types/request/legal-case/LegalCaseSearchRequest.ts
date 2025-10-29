import type { LegalCaseStatus } from "../../enum/LegalCaseStatus";

export interface LegalCaseSearchRequest {
  acceptanceNumber: string | null;
  startAcceptanceDate: string | null;
  endAcceptanceDate: string | null;
  legalCaseTypeId: string | null;
  legalRelationshipId: string | null;
  legalRelationshipGroupId: string | null;

  litigantName: string | null;
  litigantYearOfBirth: string | null;
  litigantAddress: string | null;

  legalCaseStatus: LegalCaseStatus | null;
  judgeId: string | null;
  batchId: string | null;
  startStorageDate: string | null;
  endStorageDate: string | null;
}