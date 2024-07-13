"use client";
import React from "react";
import Link from "next/link";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";

import { Category, SubCategory } from "@/types/index";

import SearchForm from "./SearchForm";

const NavMenu: React.FC<{ categories: Category[] }> = ({ categories }) => {
  return (
    <NavbarMenu>
      <SearchForm />
      <Accordion className="px-0" selectionMode="multiple">
        {categories.map((category) => (
          <AccordionItem
            key={category.id}
            aria-label={category.attributes.name}
            title={category.attributes.name}
          >
            {category.attributes.subcategories &&
            category.attributes.subcategories.data.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {category.attributes.subcategories.data.map(
                  (subCategory: SubCategory) => (
                    <NavbarMenuItem key={subCategory.id}>
                      <Link
                        className="w-full"
                        href={`/category/${subCategory.attributes.slug}`}
                      >
                        {subCategory.attributes.name}
                      </Link>
                    </NavbarMenuItem>
                  ),
                )}
              </div>
            ) : (
              <NavbarMenuItem>
                <Link
                  className="w-full"
                  href={`/category/${category.attributes.slug}`}
                >
                  {category.attributes.name}
                </Link>
              </NavbarMenuItem>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </NavbarMenu>
  );
};

export default NavMenu;
