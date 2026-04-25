"use client";

import { DesktopMenu } from "./desktop_menu"; 
import { MobileMenu } from "./mobile_menu";

export function SideMenu() {
  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  );
}