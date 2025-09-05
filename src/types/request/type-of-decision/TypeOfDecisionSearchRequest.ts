import type { CourtIssued } from "../../enum/CourtIssued";

export default interface TypeOfDecisionSearchRequest {
    typeOfDecisionId: string;
    typeOfDecisionName: string;
    typeOfLegalCaseId: string;
    courtIssued: CourtIssued;
    theEndDecision: boolean;
}