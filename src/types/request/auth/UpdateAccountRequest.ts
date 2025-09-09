export interface UpdateAccountRequest {
    accountId: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    displayName?: string;
}
