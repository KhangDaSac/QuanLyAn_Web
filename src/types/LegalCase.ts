import { type LegalRelationship } from "./LegalRelationship";
import { type Judge } from "./Judge";

interface LegalCase {
  legalCaseId: string;
  acceptanceNumber: string;
  acceptanceDate: string;
  expiredDate: string;
  plaintiff: string;
  plaintiffAddress: string;
  defendant: string;
  defendantAddress: string;
  legalRelationship: LegalRelationship;
  storageDate: string;
  assignment: string | null;
  assignmentDate: string | null;
  statusOfLegalCase: string;
  judge: Judge | null;
}

export {type LegalCase}