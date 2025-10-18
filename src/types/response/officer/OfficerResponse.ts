import type { OfficerStatus } from "../../enum/OfficerStatus";

export interface OfficerResponse{
    officerId: string;
    lastName: string;
    firstName: string;
    fullName: string;
    officerStatus: OfficerStatus;
    email: string;
}
