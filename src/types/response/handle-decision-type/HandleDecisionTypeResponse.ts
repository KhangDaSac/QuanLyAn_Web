import type { LegalCaseStatus } from "../../enum/LegalCaseStatus";
import type DecisionTypeResponse from "../decision-type/DecisionTypeResponse";

export default interface HandleDecisionTypeResponse {
    decisionType: DecisionTypeResponse;
    preStatus: LegalCaseStatus;
    postStatus: LegalCaseStatus;
    extensionPeriod: number;
}