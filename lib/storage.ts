export type UserProfile = {
  name: string;
  favoriteGenres: string[];
  readingPace: "slow" | "medium" | "fast";
  avoidTropes: string[];
  isOnboarded: boolean;
};

const PROFILE_KEY = "@livroteca:profile";

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveProfile(profile: Omit<UserProfile, "isOnboarded">) {
  if (typeof window === "undefined") return;
  const payload: UserProfile = { ...profile, isOnboarded: true };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
}