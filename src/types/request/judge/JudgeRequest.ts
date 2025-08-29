export type StatusOfJudge = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'RETIRED';

export interface JudgeRequest {
  firstName: string;
  lastName: string;
  maxNumberOfLegalCase: number;
  statusOfJudge: StatusOfJudge | null;
  email: string | null;
}