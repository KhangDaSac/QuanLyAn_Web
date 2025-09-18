import type { StatusOfOfficer } from "../../enum/StatusOfOfficer";

export interface OfficerSearchRequest {
  officerId?: string | null;
  fullName?: string | null;
  statusOfOfficer?: StatusOfOfficer | null;
}
