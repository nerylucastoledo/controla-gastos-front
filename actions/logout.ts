"use server";

import { redirect } from 'next/navigation'
import { cookies } from "next/headers";

export default async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");

  redirect("/login");
};