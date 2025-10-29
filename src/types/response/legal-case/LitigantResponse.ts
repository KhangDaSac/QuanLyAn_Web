import type { LitigantType } from "../../enum/LitigantType";

export interface LitigantResponse {
  litigantType: LitigantType;
  ordinal: number;
  name: string;
  yearOfBirth: string;
  address: string;
}