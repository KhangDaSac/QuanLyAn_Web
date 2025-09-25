export interface LegalCaseRequest {
  acceptanceNumber: string;
  acceptanceDate: string;
  plaintiff: string;
  plaintiffAddress: string;
  defendant: string;
  defendantAddress: string;
  legalRelationshipId: string;
  batchId: string;
}
