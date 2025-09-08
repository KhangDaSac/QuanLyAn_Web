import type { CourtIssued } from "../../enum/CourtIssued";
import type { TypeOfLegalCaseResponse } from "../type-of-legal-case/TypeOfLegalCaseResponse";

export default interface TypeOfDecisionResponse {
    typeOfDecisionId: string;
    typeOfDecisionName: string;
    typeOfLegalCase: TypeOfLegalCaseResponse;
    courtIssued: CourtIssued;
    theEndDecision: boolean;
}