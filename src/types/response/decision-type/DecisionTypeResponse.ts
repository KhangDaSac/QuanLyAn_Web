import type { CourtIssued } from "../../enum/CourtIssued";
import type { LegalCaseTypeResponse } from "../legal-case-type/LegalCaseTypeResponse";

export default interface DecisionTypeResponse {
    decisionTypeId: string;
    decisionTypeName: string;
    legalCaseType: LegalCaseTypeResponse;
    courtIssued: CourtIssued;
    theEndDecision: boolean;
}