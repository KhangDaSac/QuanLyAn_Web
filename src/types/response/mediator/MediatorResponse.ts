import type { OfficerResponse } from "../officer/OfficerResponse";

export interface MediatorResponse extends OfficerResponse {
  numberOfLegalCases: number;
}
