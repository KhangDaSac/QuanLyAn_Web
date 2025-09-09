import type { StatusOfOfficer } from "../../enum/StatusOfOfficer";

export interface OfficerResponse{
    officerId: string;
    lastName: string;
    firstName: string;
    fullName: string;
    statusOfOfficer: StatusOfOfficer;
    email: string;
}
