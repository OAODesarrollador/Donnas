import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "donnas_admin_session";

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEFAULT_ADMIN_SESSION_TOKEN = "donnas-admin-test-session";

export const getAdminCredentials = () => ({
  username: process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD,
});

const getAdminSessionToken = () => process.env.ADMIN_SESSION_TOKEN ?? DEFAULT_ADMIN_SESSION_TOKEN;

export const isValidAdminLogin = (username: string, password: string) => {
  const credentials = getAdminCredentials();
  return username === credentials.username && password === credentials.password;
};

export const isAdminSessionValid = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === getAdminSessionToken();
};

export const createAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, getAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
};
