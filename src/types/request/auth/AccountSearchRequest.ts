import type { Role } from "../../enum/Role";
import type { AccountStatus } from "../../enum/AccountStatus";

export interface AccountSearchRequest {
  accountId?: string | null;
  email?: string | null;
  fullName?: string | null;
  role?: Role | null;
  statusOfAccount?: AccountStatus | null;
}