import type { CourtIssued } from "../../enum/CourtIssued";

export default interface DecisionTypeRequest {
    decisionTypeName?: string | null;
    legalCaseTypeId?: string | null;
    courtIssued?: CourtIssued | null;
    theEndDecision?: boolean | null;
}