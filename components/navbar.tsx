import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import Image from "next/image";
import React from "react";

import { ThemeSwitch } from "@/components/theme-switch";

import NavbarItemComponent from "./NavbarItem";
import SearchForm from "./SearchForm";
import BookmarkButton from "./BookmarkButton";

// 定义 categories 的 TypeScript 接口
interface Category {
  id: string;
  attributes: {
    name: string;
    slug?: string;
    subcategories?: {
      data: Array<{
        id: string;
        attributes: {
          name: string;
          slug: string;
        };
      }>;
    };
  };
}

interface NavbarProps {
  categories: Category[];
}

export const Navbar: React.FC<NavbarProps> = ({ categories }) => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <span className="flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 w-10 h-10 text-tiny bg-default text-default-foreground rounded-small">
              <Image
                alt="avatar"
                className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-0 data-[loaded=true]:opacity-100"
                data-loaded="true"
                height={256}
                src="/logo.webp"
                width={256}
              />
            </span>
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

      <NavbarMenu>
        <SearchForm />
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {categories.map((category) => (
            <NavbarItemComponent key={category.id} category={category} />
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
