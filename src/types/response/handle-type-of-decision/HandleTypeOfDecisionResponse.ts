import type { StatusOfLegalCase } from "../../enum/StatusOfLegalCase";
import type TypeOfDecisionResponse from "../type-of-decision/TypeOfDecisionResponse";

export default interface HandleTypeOfDecisionResponse {
    typeOfDecision: TypeOfDecisionResponse;
    preStatus: StatusOfLegalCase;
    postStatus: StatusOfLegalCase;
    extensionPeriod: number;
}