export interface LegalCaseRequest {
  acceptanceNumber: string;
  acceptanceDate: string;
  plaintiff: string;
  plaintiffAddress: string | null;
  defendant: string | null;
  defendantAddress: string | null;
  note: string | null;
  legalRelationshipId: string;
  judgeId: string | null;
  mediatorId: string | null;
  batchId: string;
}
