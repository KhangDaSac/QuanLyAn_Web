import type { StatusOfLegalCase } from "../../enum/StatusOfLegalCase";

export interface HandleTypeOfDecisionRequest {
    typeOfDecisionId: string;
    preStatus: StatusOfLegalCase;
    postStatus: StatusOfLegalCase;
    extensionPeriod: number;
}