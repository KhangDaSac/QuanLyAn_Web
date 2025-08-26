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
  statusOfLegalCase: string | null;
  judgeName: string | null;
  batchId: string | null;
  storageDate: string | null;
}