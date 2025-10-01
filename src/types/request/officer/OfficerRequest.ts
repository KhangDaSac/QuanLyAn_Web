import type { StatusOfOfficer } from "../../enum/StatusOfOfficer";

export interface OfficerRequest {
  firstName?: string | null;
  lastName?: string | null;
  statusOfOfficer?: StatusOfOfficer | null;
  email?: string | null;
}
