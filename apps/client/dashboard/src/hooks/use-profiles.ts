import { ProfileSchema, type Profile } from "@monyfox/common-data";
import { useState } from "react";

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>(() =>
    getProfilesFromLocalStorage(),
  );

  function createProfile(profile: Profile) {
    localStorage.setItem(`profile:${profile.id}`, JSON.stringify(profile));
    setProfiles((profiles) => [...profiles, profile]);
  }

  function deleteProfile(profileId: string) {
    localStorage.removeItem(`profile:${profileId}`);
    setProfiles((profiles) => profiles.filter((p) => p.id !== profileId));
  }

  return { profiles, createProfile, deleteProfile };
}

function getProfilesFromLocalStorage() {
  const profiles: Profile[] = [];

  for (
    let i = 0, key = localStorage.key(i);
    key !== null;
    i += 1, key = localStorage.key(i)
  ) {
    if (!key.startsWith("profile:")) {
      continue;
    }

    const value = localStorage.getItem(key);
    if (value === null) {
      continue;
    }

    try {
      const profile = ProfileSchema.parse(JSON.parse(value));
      profiles.push(profile);
    } catch (e) {
      console.error(e);
    }
  }

  return profiles;
}
