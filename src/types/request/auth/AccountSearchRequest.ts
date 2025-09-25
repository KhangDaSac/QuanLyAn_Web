import type { Role } from "../../enum/Role";
import type { StatusOfAccount } from "../../enum/StatusOfAccount";

export interface AccountSearchRequest {
  accountId?: string | null;
  email?: string | null;
  fullName?: string | null;
  role?: Role | null;
  statusOfAccount?: StatusOfAccount | null;
}