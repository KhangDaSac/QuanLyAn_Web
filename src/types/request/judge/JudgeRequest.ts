import type { StatusOfJudge } from "../../enum/StatusOfJudge";

export interface JudgeRequest {
  firstName: string;
  lastName: string;
  maxNumberOfLegalCase: number;
  statusOfJudge: StatusOfJudge | null;
  email: string | null;
}