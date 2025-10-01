import type { OfficerRequest } from "../officer/OfficerRequest";

export interface JudgeRequest extends OfficerRequest {
  maxNumberOfLegalCase?: number | null;
}