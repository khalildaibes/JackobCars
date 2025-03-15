// utils/getFavorites.ts (Server Utility)
import { cookies } from "next/headers";

export function getFavoritesFromCookies(): number[] {
  "use server"; // Ensures it's a server function

  const cookieStore = cookies();
  const storedFavorites = cookieStore.get("favorites")?.value;

  return storedFavorites ? JSON.parse(storedFavorites) : [];
}
