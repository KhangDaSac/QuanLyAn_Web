export type StatusOfJudge = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'RETIRED';

export interface JudgeRequest {
  firstName: string;
  lastName: string;
  maxNumberOfLegalCase: number;
  statusOfJudge: StatusOfJudge;
  email: string;
}

export interface JudgeCreateRequest {
  firstName: string;
  lastName: string;
  maxNumberOfLegalCase: number;
  email: string;
}
