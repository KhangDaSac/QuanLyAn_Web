import type { Role } from "../../enum/Role";

export default interface AccountRequest {
    username: string;
    password: string;
    email: string;
    role: Role;
}