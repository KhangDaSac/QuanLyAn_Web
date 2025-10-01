import type { CourtIssued } from "../../enum/CourtIssued";

export default interface TypeOfDecisionUpdateRequest {
    typeOfDecisionName?: string | null;
    typeOfLegalCaseId?: string | null;
    courtIssued?: CourtIssued | null;
    theEndDecision?: boolean | null;
}
