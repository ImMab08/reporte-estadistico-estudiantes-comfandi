"use client";

import { DesktopMenu } from "./desktop_menu"; 
import { MobileMenu } from "./mobile_menu";
import type { SessionUser } from "@/src/lib/session";

export function SideMenu({ user }: { user: SessionUser | null }) {
  return (
    <>
      <MobileMenu user={user} />
      <DesktopMenu user={user} />
    </>
  );
}