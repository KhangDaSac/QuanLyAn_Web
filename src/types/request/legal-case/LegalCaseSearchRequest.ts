import type { StatusOfLegalCase } from "../../enum/StatusOfLegalCase";

export interface LegalCaseSearchRequest {
  acceptanceNumber: string | null;
  startAcceptanceDate: string | null;
  endAcceptanceDate: string | null;
  plaintiff: string | null;
  plaintiffAddress: string | null;
  defendant: string | null;
  defendantAddress: string | null;
  typeOfLegalCaseId: string | null;
  legalRelationshipId: string | null;
  legalRelationshipGroupId: string | null;
  statusOfLegalCase: StatusOfLegalCase | null;
  judgeId: string | null;
  batchId: string | null;
  startStorageDate: string | null;
  endStorageDate: string | null;
}