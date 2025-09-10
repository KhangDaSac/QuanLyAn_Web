import type { OfficerResponse } from "../officer/OfficerResponse";

export interface JudgeResponse extends OfficerResponse {
  maxNumberOfLegalCase: number;
  numberOfLegalCases: number;
  numberOfTemporarySuspension: number;
  numberOfOverdue: number;
  numberOfCanceledAndEdited: number;
}