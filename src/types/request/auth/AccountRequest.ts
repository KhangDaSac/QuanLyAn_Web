import type { Role } from "../../enum/Role";
import type { AccountStatus } from "../../enum/AccountStatus";

export default interface AccountRequest {
    username?: string | null;
    password?: string | null;
    email?: string | null;
    role?: Role | null;
    accountStatus?: AccountStatus | null;
}