import type { StatusOfJudge } from "../../enum/StatusOfJudge";

export interface JudgeSearchRequest {
  judgeId?: string | null;
  fullName?: string | null;
  statusOfJudge?: StatusOfJudge | null;
}
