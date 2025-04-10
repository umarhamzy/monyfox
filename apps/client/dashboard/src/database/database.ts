import { type Profile } from "@monyfox/common-data";

export interface Database {
  init(): Promise<void>;
  getProfiles(): Promise<Profile[]>;
  saveProfile(profile: Profile): Promise<void>;
  deleteProfile(id: string): Promise<void>;
}
