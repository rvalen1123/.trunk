"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Switch,
} from "@nextui-org/react";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function DashboardNavbar({ onMenuToggle }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Navbar maxWidth="full" className="border-b border-divider">
      <NavbarContent className="sm:hidden">
        <Button
          isIconOnly
          variant="light"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </Button>
      </NavbarContent>

      <NavbarBrand className="hidden sm:flex">
        <p className="font-bold text-inherit">MSC Wound Care Portal</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Switch
            defaultSelected={isDark}
            size="sm"
            color="primary"
            startContent={<SunIcon className="h-4 w-4" />}
            endContent={<MoonIcon className="h-4 w-4" />}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
        </NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="primary"
              name="John Doe"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">john.doe@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Profile</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
