import type { OfficerResponse } from "../officer/OfficerResponse";

export interface JudgeResponse extends OfficerResponse {
  maxNumberOfLegalCase: number;
  numberOfLegalCase: number;
  numberOfInProcess: number;
  numberOfTemporarySuspension: number;
  numberOfOverdue: number;
  numberOfCanceledAndEdited: number;
}