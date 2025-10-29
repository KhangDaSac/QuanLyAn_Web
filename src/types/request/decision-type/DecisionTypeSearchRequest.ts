import type { CourtIssued } from "../../enum/CourtIssued";

export default interface DecisionTypeSearchRequest {
    decisionTypeId: string | null;
    decisionTypeName: string | null;
    legalCaseTypeId: string | null;
    courtIssued: CourtIssued | null;
    theEndDecision: boolean | null;
}