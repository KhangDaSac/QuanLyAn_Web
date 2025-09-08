import { type TypeOfLegalCaseResponse } from "../../response/type-of-legal-case/TypeOfLegalCaseResponse";

export interface LegalRelationshipRequest {
  legalRelationshipName: string;
  typeOfLegalCase?: TypeOfLegalCaseResponse;
  typeOfLegalCaseId: string;
  legalRelationshipGroupId: string;
}
