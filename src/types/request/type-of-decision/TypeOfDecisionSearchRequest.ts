import type { CourtIssued } from "../../enum/CourtIssued";

export default interface TypeOfDecisionSearchRequest {
    typeOfDecisionId: string | null;
    typeOfDecisionName: string | null;
    typeOfLegalCaseId: string | null;
    courtIssued: CourtIssued | null;
    theEndDecision: boolean | null;
}