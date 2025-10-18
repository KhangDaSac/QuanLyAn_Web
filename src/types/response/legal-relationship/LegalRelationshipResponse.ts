import type { LegalRelationshipGroupResponse } from "../legal-relationship-group/LegalRelationshipGroupResponse";
import type { LegalCaseTypeResponse } from "../legal-case-type/LegalCaseTypeResponse";

export interface LegalRelationshipResponse {
    legalRelationshipId: string;
    legalRelationshipName: string;
    legalCaseType: LegalCaseTypeResponse;
    legalRelationshipGroup: LegalRelationshipGroupResponse;
}