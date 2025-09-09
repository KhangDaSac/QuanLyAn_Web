import type { StatusOfAccount } from "../../enum/StatusOfAccount";
import type { OfficerResponse } from "../officer/OfficerResponse";

export interface AccountResponse {
    accountId: string;
    email: string;
    fullName: string;
    role: string;
    officerResponse: OfficerResponse;
    statusOfAccount: StatusOfAccount;
}