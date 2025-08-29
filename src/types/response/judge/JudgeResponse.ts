import type { StatusOfJudge } from '../../request/judge/JudgeRequest';

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