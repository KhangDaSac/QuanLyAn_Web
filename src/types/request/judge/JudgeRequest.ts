import { StatusOfJudge } from "../../enum/StatusOfJudge";

export interface JudgeRequest {
  firstName: string;
  lastName: string;
  maxNumberOfLegalCase: number;
  statusOfJudge: keyof typeof StatusOfJudge | null;
  email: string | null;
}