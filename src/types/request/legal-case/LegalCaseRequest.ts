import type { LitigantRequest } from "./LitigantRequest";

export interface LegalCaseRequest {
  acceptanceNumber: string | null;
  acceptanceDate: string | null;
  note: string | null;
  legalRelationshipId: string | null;
  litigants: LitigantRequest[];
  judgeId: string | null;
  mediatorId: string | null;
  batchId: string | null;
}
