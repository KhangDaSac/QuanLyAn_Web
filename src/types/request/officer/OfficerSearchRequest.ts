import type { OfficerStatus } from "../../enum/OfficerStatus";

export interface OfficerSearchRequest {
  officerId?: string | null;
  fullName?: string | null;
  officerStatus?: OfficerStatus | null;
}
