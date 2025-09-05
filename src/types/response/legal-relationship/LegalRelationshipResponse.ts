import type { LegalRelationshipGroupResponse } from "../legal-relationship-group/LegalRelationshipGroupResponse";
import type { TypeOfLegalCaseResponse } from "../type-of-legal-case/TypeOfLegalCaseResponse";

export interface LegalRelationshipResponse {
    legalRelationshipId: string;
    legalRelationshipName: string;
    typeOfLegalCase: TypeOfLegalCaseResponse;
    legalRelationshipGroup: LegalRelationshipGroupResponse;
}