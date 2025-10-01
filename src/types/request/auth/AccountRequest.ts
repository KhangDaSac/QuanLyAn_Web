import type { Role } from "../../enum/Role";
import type { StatusOfAccount } from "../../enum/StatusOfAccount";

export default interface AccountRequest {
    username?: string | null;
    password?: string | null;
    email?: string | null;
    role?: Role | null;
    statusOfAccount?: StatusOfAccount | null;
}