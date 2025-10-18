import type { LegalCaseStatus } from "../../enum/LegalCaseStatus";

export interface HandleDecisionTypeRequest {
    decisionTypeId: string;
    preStatus: LegalCaseStatus;
    postStatus: LegalCaseStatus;
    extensionPeriod: number;
}