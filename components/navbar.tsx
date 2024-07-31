import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Avatar } from "@nextui-org/avatar";
import NextLink from "next/link";
import React from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import { Category } from "@/types";

import NavbarItemComponent from "./NavbarItem";
import SearchForm from "./SearchForm";
import BookmarkButton from "./BookmarkButton";
import NavMenu from "./NavMenu";

interface NavbarProps {
  categories: Category[];
}

export const Navbar: React.FC<NavbarProps> = ({ categories }) => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Avatar isBordered radius="sm" src="/logo.webp" />
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {categories.map((category) => (
            <NavbarItemComponent key={category.id} category={category} /> // 使用 NavbarItemComponent 替换重复的逻辑
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <SearchForm />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          <BookmarkButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavMenu categories={categories} />
    </NextUINavbar>
  );
};
