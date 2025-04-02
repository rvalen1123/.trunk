"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import ThemeToggle from "@/components/common/theme-toggle";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function DashboardNavbar({ onMenuToggle }: NavbarProps) {
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
          <ThemeToggle />
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
