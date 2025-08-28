import { type LegalRelationshipGroupResponse } from "./LegalRelationshipGroup";
import { type TypeOfLegalCaseResponse } from "./TypeOfLegalCaseResponse";
export interface LegalRelationshipResponse {
  legalRelationshipId: string;
  legalRelationshipName: string;
  typeOfLegalCase: TypeOfLegalCaseResponse;
  legalRelationshipGroup: LegalRelationshipGroupResponse;
}