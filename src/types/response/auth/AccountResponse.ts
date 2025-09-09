import type { Role } from "../../enum/Role";

export interface AccountResponse {
    accountId: string;
    username: string;
    email: string;
    role: Role;
    displayName?: string | null;
    judgeId?: string | null;
    createdAt: string;
    lastLoginAt?: string | null;
    isActive: boolean;
}
