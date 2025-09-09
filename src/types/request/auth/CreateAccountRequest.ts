export interface CreateAccountRequest {
    username: string;
    password: string;
    email: string;
    role: string;
    displayName?: string;
}
