import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth(request => {
  const user = request.auth?.user as { role?: string } | undefined;
  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  if (user.role !== "ADMIN") return NextResponse.redirect(new URL("/", request.url));
  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*"] };
