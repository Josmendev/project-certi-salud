import { useState } from "react";
import { useSearchParams } from "react-router";

export const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchParams({ page: "1" });
  };

  return {
    currentPage,
    searchQuery,
    handlePageChange,
    handleSearch,
  };
};
