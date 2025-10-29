import { type LegalRelationshipResponse } from "../legal-relationship/LegalRelationshipResponse";
import { type JudgeResponse } from "../judge/JudgeResponse"; 
import type { LegalCaseStatus } from "../../enum/LegalCaseStatus";
import type { BatchResponse } from "../batch/BatchResponse";
import type { MediatorResponse } from "../mediator/MediatorResponse";
import type { LitigantResponse } from "./LitigantResponse";

export interface LegalCaseResponse {
  legalCaseId: string;
  acceptanceNumber: string;
  acceptanceDate: string;
  expiredDate: string;
  note: string | null;
  legalRelationship: LegalRelationshipResponse;
  litigants: LitigantResponse[];
  storageDate: string;
  assignment: string | null;
  assignmentDate: string | null;
  legalCaseStatus: LegalCaseStatus;
  batch: BatchResponse | null;
  judge: JudgeResponse | null;
  mediator: MediatorResponse | null;
}
