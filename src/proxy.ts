import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";

const LOGIN_PATH = "/login";

const ROLE_DASHBOARDS = {
  admin: "/admin/dashboard",
  employee: "/employee/dashboard",
} as const;

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;
  const user = token ? await verifyToken(token) : null;

  const isLoginPage = pathname === LOGIN_PATH;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isEmployeeRoute =
    pathname === "/employee" || pathname.startsWith("/employee/");

  // کاربر لاگین نکرده است
  if (!user) {
    if (isLoginPage) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  // کاربر لاگین کرده و صفحه Login را باز کرده است
  if (isLoginPage || pathname === "/") {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARDS[user.role], request.url),
    );
  }

  // جلوگیری از ورود کارمند به صفحات ادمین
  if (isAdminRoute && user.role !== "admin") {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARDS[user.role], request.url),
    );
  }

  // جلوگیری از ورود ادمین به صفحات کارمند
  if (isEmployeeRoute && user.role !== "employee") {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARDS[user.role], request.url),
    );
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
