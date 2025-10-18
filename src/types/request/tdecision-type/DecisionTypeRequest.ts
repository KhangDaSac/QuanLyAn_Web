import type { CourtIssued } from "../../enum/CourtIssued";

export default interface DecisionTypeRequest {
    decisionTypeName?: string | null;
    LegalCaseTypeId?: string | null;
    courtIssued?: CourtIssued | null;
    theEndDecision?: boolean | null;
}