/*
 * @Author: your name
 * @Date: 2025-05-29 10:24:26
 * @LastEditTime: 2025-05-29 11:02:24
 * @LastEditors: 韦玮莹
 * @Description: In User Settings Edit
 * @FilePath: \inventory-management\next-client\src\middleware\index.ts
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl; // 获取请求路径

  // 用户已经登录，重定向到仪表盘
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // 配置需要进行身份验证检查的路径
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}