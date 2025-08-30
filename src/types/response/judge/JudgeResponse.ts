import type { StatusOfJudge } from "../../enum/StatusOfJudge";

export interface JudgeResponse {
  judgeId: string;
  lastName: string;
  firstName: string;
  fullName: string;
  maxNumberOfLegalCase: number;
  numberOfLegalCases: number;
  numberOfTemporarySuspension: number;
  numberOfOverdue: number;
  numberOfCanceledAndEdited: number;
  statusOfJudge: StatusOfJudge;
  email: string;
}