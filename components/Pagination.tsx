"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "@nextui-org/pagination";

interface PaginationComponentProps {
  basePath: string;
  slug: string;
  pageNumber: number;
  totalPages: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  basePath,
  slug,
  pageNumber,
  totalPages,
}) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`${basePath}/${slug}/${page}`);
  };

  return (
    <Pagination
      color="warning"
      initialPage={pageNumber}
      total={totalPages}
      onChange={handlePageChange}
    />
  );
};

export default PaginationComponent;
