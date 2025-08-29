import type { StatusOfJudge } from "../../enum/StatusOfJudge";


export interface JudgeResponse {
  judgeId: string;
  lastName: string;
  firstName: string;
  fullName: string;
  maxNumberOfLegalCase: number;
  numberOfLegalCases: number;
  statusOfJudge: StatusOfJudge;
  email: string;
}