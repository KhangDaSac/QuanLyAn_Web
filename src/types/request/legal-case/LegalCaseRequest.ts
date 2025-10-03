export interface LegalCaseRequest {
  acceptanceNumber: string | null;
  acceptanceDate: string | null;
  plaintiff: string | null;
  plaintiffAddress: string | null;
  defendant: string | null;
  defendantAddress: string | null;
  note: string | null;
  legalRelationshipId: string | null;
  judgeId: string | null;
  mediatorId: string | null;
  batchId: string | null;
}
