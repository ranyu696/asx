"use client";
import React from "react";
// 假设这些组件和类型在其他文件中定义，需要相应地导入
import { NavbarItem } from "@nextui-org/navbar";
import NextLink from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";

import { ChevronDown } from "@/components/icons";
import { Category } from "@/types";

const NavbarItemComponent: React.FC<{ category: Category }> = ({
  category,
}) => (
  <NavbarItem key={category.id}>
    {category.attributes.subcategories &&
    category.attributes.subcategories.data.length > 0 ? (
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content: "p-0 border-small border-divider bg-background",
        }}
        radius="sm"
      >
        <DropdownTrigger>
          <Button
            className="data-[active=true]:text-primary data-[active=true]:font-medium"
            endContent={<ChevronDown fill="currentColor" size={16} />}
          >
            {category.attributes.name}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label={category.attributes.name}>
          {category.attributes.subcategories.data.map((subcategory) => (
            <DropdownItem
              key={subcategory.id}
              className="flex justify-center items-center text-center w-full"
              href={`/category/${subcategory.attributes.slug}`}
            >
              {subcategory.attributes.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    ) : (
      <NextLink href={`/category/${category.attributes.slug || ""}`}>
        <Button className="data-[active=true]:text-primary data-[active=true]:font-medium">
          {category.attributes.name}
        </Button>
      </NextLink>
    )}
  </NavbarItem>
);

export default NavbarItemComponent;
