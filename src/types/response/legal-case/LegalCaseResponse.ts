import { type LegalRelationshipResponse } from "./LegalRelationshipResponse";
import { type JudgeResponse } from "../judge/JudgeResponse"; 

export interface LegalCaseResponse {
  legalCaseId: string;
  acceptanceNumber: string;
  acceptanceDate: string;
  expiredDate: string;
  plaintiff: string;
  plaintiffAddress: string;
  defendant: string;
  defendantAddress: string;
  legalRelationship: LegalRelationshipResponse;
  storageDate: string;
  assignment: string | null;
  assignmentDate: string | null;
  statusOfLegalCase: string;
  judge: JudgeResponse | null;
}
