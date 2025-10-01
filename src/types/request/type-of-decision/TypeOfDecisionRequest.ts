import type { CourtIssued } from "../../enum/CourtIssued";

export default interface TypeOfDecisionRequest {
    typeOfDecisionName?: string | null;
    typeOfLegalCaseId?: string | null;
    courtIssued?: CourtIssued | null;
    theEndDecision?: boolean | null;
}