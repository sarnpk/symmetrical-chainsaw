"use client"

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { Menu as MenuIcon, X as XIcon, Bell, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MobileNavbarProps {
  onMenuClick?: () => void
}

export default function MobileNavbar({ onMenuClick }: MobileNavbarProps) {
  const pathname = usePathname()

  const nav = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Journal", href: "/journal" },
    { name: "Patterns", href: "/patterns" },
    { name: "AI Coach", href: "/ai-coach" },
    { name: "Usage", href: "/usage" },
    { name: "Subscription", href: "/subscription" },
  ]

  return (
    <Disclosure as="nav" className="lg:hidden bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b shadow-sm">
      {({ open }) => (
        <>
          <div className="px-3 sm:px-4">
            <div className="relative flex h-14 items-center justify-between">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={onMenuClick}
                  className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span className="sr-only">Open sidebar</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center">
                <Shield className="h-6 w-6 text-indigo-600" />
                <span className="ml-2 text-base font-semibold text-gray-900">Reclaim</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="relative rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </button>

                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                  <XIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={
                      "block rounded-md px-3 py-2 text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " +
                      (active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900")
                    }
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  )
}
