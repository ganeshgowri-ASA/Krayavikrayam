import { cookies } from "next/headers";

export type Role =
  | "Buyer"
  | "Approver"
  | "Inspector"
  | "Supplier"
  | "Admin";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const SESSION_COOKIE = "kvk_session";

const DEMO_USER: CurrentUser = {
  id: "user_demo",
  name: "Asha Kumar",
  email: "asha@krayavikrayam.dev",
  role: "Buyer",
};

// Stub: reads a session cookie and returns the current user, or null if
// unauthenticated. Replaced in Track A/F sessions with real session decoding.
export function getCurrentUser(): CurrentUser | null {
  const session = cookies().get(SESSION_COOKIE)?.value;
  if (process.env.NEXT_PUBLIC_AUTH_BYPASS === "1") return DEMO_USER;
  if (!session) return null;
  // The placeholder session value is just the user id; later versions verify a JWT.
  return { ...DEMO_USER, id: session };
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export const AUTH_BYPASS_FOR_LOCAL_DEV = true;
