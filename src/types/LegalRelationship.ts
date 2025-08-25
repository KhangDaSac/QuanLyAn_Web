import { type LegalRelationshipGroup } from "./LegalRelationshipGroup";
import { type TypeOfLegalCase } from "./TypeOfLegalCase";
interface LegalRelationship {
  legalRelationshipId: string;
  legalRelationshipName: string;
  typeOfLegalCase: TypeOfLegalCase;
  legalRelationshipGroup: LegalRelationshipGroup;
}

export {type LegalRelationship}