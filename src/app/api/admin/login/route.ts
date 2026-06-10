import { createAdminSession, isValidAdminLogin } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: unknown; password?: unknown };
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!isValidAdminLogin(username, password)) {
    return Response.json({ error: "Usuario o clave incorrectos." }, { status: 401 });
  }

  await createAdminSession();
  return Response.json({ ok: true });
}
