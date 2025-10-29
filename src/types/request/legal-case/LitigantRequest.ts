import type { LitigantType } from "../../enum/LitigantType";

export interface LitigantRequest {
  litigantType: LitigantType | null;
  ordinal: number | null;
  name: string | null;
  yearOfBirth: string | null;
  address: string | null;
}