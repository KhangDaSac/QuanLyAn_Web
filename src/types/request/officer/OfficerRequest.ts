import type { StatusOfOfficer } from "../../enum/StatusOfOfficer";

export interface OfficerRequest {
  firstName: string;
  lastName: string;
  statusOfOfficer: StatusOfOfficer | null;
  email: string | null;
}
