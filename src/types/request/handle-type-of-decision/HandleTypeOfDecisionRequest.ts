import type { StatusOfLegalCase } from "../../enum/StatusOfLegalCase";

export default interface HandleTypeOfDecisionResponse {
    typeOfDecisionId: string;
    preStatus: StatusOfLegalCase;
    postStatus: StatusOfLegalCase;
    extensionPeriod: number;
}