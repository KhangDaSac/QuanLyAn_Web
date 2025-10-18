import type { OfficerStatus } from "../../enum/OfficerStatus";

export interface OfficerRequest {
  firstName?: string | null;
  lastName?: string | null;
  officerStatus?: OfficerStatus | null;
  email?: string | null;
}
