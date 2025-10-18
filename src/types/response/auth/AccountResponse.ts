import type { Role } from "../../enum/Role";
import type { AccountStatus } from "../../enum/AccountStatus";
import type { OfficerResponse } from "../officer/OfficerResponse";

export interface AccountResponse {
    accountId: string;
    email: string;
    username: string;
    role: Role;
    officer: OfficerResponse;
    accountStatus: AccountStatus;
}