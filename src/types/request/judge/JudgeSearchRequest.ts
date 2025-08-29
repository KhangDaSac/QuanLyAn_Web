import type { StatusOfJudge } from './JudgeRequest';

export interface JudgeSearchRequest {
  judgeId?: string | null;
  fullName?: string | null;
  statusOfJudge?: StatusOfJudge | null;
}
