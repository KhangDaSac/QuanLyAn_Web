import type { StatusOfLegalCase } from "../../enum/StatusOfLegalCase";

export default interface AccountRequest {
    typeOfDecisionId: string;
    preStatus: StatusOfLegalCase;
    postStatus: StatusOfLegalCase;
    extensionPeriod: number;
}