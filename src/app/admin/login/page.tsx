import { redirect } from "next/navigation";
import { isAdminSessionValid } from "@/lib/adminAuth";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  if (await isAdminSessionValid()) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
