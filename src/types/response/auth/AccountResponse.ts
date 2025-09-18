import type { Role } from "../../enum/Role";
import type { StatusOfAccount } from "../../enum/StatusOfAccount";
import type { OfficerResponse } from "../officer/OfficerResponse";

export interface AccountResponse {
    accountId: string;
    email: string;
    username: string;
    role: Role;
    officer: OfficerResponse;
    statusOfAccount: StatusOfAccount;
}