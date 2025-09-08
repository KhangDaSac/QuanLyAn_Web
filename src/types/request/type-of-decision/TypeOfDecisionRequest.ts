import type { CourtIssued } from "../../enum/CourtIssued";

export default interface TypeOfDecisionRequest {
    typeOfDecisionName: string;
    typeOfLegalCaseId: string;
    courtIssued: CourtIssued;
    theEndDecision: boolean;
}