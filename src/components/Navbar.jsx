"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "./ui/button";

/**
 * NavigationBar with a custom mobile-only side menu (no NavbarMenu / Toggle used)
 * - Mobile (sm:hidden): hamburger opens a left side drawer with overlay
 * - Desktop (sm:flex): regular inline links and a CTA button
 */
export default function NavigationBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "My Services", href: "/services" },
      { label: "Showcase", href: "/showcase" },
      { label: "Pricing", href: "/request-pricing" },
      { label: "Contact Me", href: "/contact-me", cta: true },
    ],
    []
  );

  const close = useCallback(() => setOpen(false), []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC to close + lock scroll when open
  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (open) {
      const onKey = (e) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      document.body.classList.add("overflow-hidden");
      setTimeout(() => closeBtnRef.current?.focus(), 0);
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.classList.remove("overflow-hidden");
      };
    }
  }, [open]);

  return (
    <Navbar className="z-[100] p-4 bg-black/90">
      {/* Left: Hamburger (mobile only) */}
      <NavbarContent className="sm:hidden" justify="start">
        <button
          type="button"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-xl p-2 text-white outline-none hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-yellow-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M3.75 6.75A.75.75 0 0 1 4.5 6h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm.75 4.5a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </NavbarContent>

      {/* Brand */}
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link href="/" className="font-bold text-white">
            Iyad Almsara
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop links */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            {item.cta ? (
              <Link href={item.href}>
                <Button className="bg-yellow-500 text-black hover:bg-yellow-600">
                  {item.label}
                </Button>
              </Link>
            ) : (
              <Link
                href={item.href}
                className={`hover:text-yellow-400 ${
                  pathname === item.href ? "text-yellow-400" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            )}
          </NavbarItem>
        ))}
      </NavbarContent>

      <MobileSideMenu
        open={open}
        onClose={close}
        menuItems={menuItems}
        pathname={pathname}
      />
    </Navbar>
  );
}

function MobileSideMenu({ open, onClose, menuItems, pathname }) {
  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-black/70 transition-opacity duration-200 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 left-0 z-[100] w-72 max-w-[85%] bg-black border-r border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <span className="font-semibold text-white">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl p-2 text-white hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-yellow-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`block rounded-xl px-4 py-3 text-base ${
                pathname === item.href
                  ? "bg-yellow-500 text-black"
                  : item.cta
                  ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                  : "text-white hover:bg-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Iyad Almsara
        </div>
      </aside>
    </>
  );
}
