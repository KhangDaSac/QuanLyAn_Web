import { type LegalRelationshipResponse } from "../legal-relationship/LegalRelationshipResponse";
import { type JudgeResponse } from "../judge/JudgeResponse"; 
import type { LegalCaseStatus } from "../../enum/LegalCaseStatus";
import type { BatchResponse } from "../batch/BatchResponse";
import type { MediatorResponse } from "../mediator/MediatorResponse";

export interface LegalCaseResponse {
  legalCaseId: string;
  acceptanceNumber: string;
  acceptanceDate: string;
  expiredDate: string;
  plaintiff: string;
  plaintiffAddress: string;
  defendant: string;
  defendantAddress: string;
  note: string | null;
  legalRelationship: LegalRelationshipResponse;
  storageDate: string;
  assignment: string | null;
  assignmentDate: string | null;
  legalCaseStatus: LegalCaseStatus;
  judge: JudgeResponse | null;
  batch: BatchResponse | null;
  mediator: MediatorResponse | null;
}
