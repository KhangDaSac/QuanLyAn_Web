import type { LegalCaseResponse } from "../legal-case/LegalCaseResponse";

export default interface DecisionResponse {
    decisionId: string;
    number: string;
    releaseDate: string;
    addedDate: string;
    note: string;
    typeOfDecision: string;
    legalCase: LegalCaseResponse;
}