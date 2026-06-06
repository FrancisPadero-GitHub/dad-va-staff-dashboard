"use server";

import { cookies } from "next/headers";

const TEMP_PASSWORD = "D@DLLC";

export async function verifyPassword(password: string) {
  if (password === TEMP_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("info_auth", "unlocked", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/info",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }
  
  return { success: false, error: "Incorrect password. Try again." };
}
