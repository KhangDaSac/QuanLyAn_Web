import { type LegalCaseTypeResponse } from "../../response/legal-case-type/LegalCaseTypeResponse";

export interface LegalRelationshipRequest {
  legalRelationshipName: string;
  legalCaseType?: LegalCaseTypeResponse;
  legalCaseTypeId: string;
  legalRelationshipGroupId: string;
}
