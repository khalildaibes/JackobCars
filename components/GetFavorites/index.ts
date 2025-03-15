// utils/getFavorites.ts
import { cookies } from "next/headers";

export function getFavoritesFromCookies(): number[] {
  const cookieStore = cookies();
  const storedFavorites = cookieStore.get("favorites")?.value;
  return storedFavorites ? JSON.parse(storedFavorites) : [];
}
