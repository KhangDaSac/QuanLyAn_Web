import type { Role } from "../../enum/Role";
import type { StatusOfAccount } from "../../enum/StatusOfAccount";

export default interface AccountRequest {
    username: string;
    password: string;
    email: string;
    role: Role;
    statusOfAccount: StatusOfAccount;
}