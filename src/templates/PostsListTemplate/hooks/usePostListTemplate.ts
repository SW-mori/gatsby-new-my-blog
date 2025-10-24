import { ChangeEvent, useEffect, useState } from "react";
import { EXTERNAL_API_URL } from "../constants";
import { RelatedArticle } from "../types";

export const usePostListTemplate = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);

  const pushEvent = (event: string, data: Record<string, any> = {}) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event, ...data });
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    pushEvent("search_input", {
      search_term: value,
      page_path: window.location.pathname,
    });
  };

  const handleTagChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    setSelectedTag(tag);
    pushEvent("tag_filter", {
      tag_name: tag || "all",
      page_path: window.location.pathname,
    });
  };

  const handleTagClick = (tag: string) => {
    const event = {
      target: { value: tag },
    } as React.ChangeEvent<HTMLSelectElement>;
    handleTagChange(event);
  };

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(EXTERNAL_API_URL);
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        setRelatedArticles(data);
      } catch {}
    };

    fetchRelated();
  }, []);

  return {
    searchTerm,
    selectedTag,
    relatedArticles,
    handleSearchChange,
    handleTagChange,
    handleTagClick,
    pushEvent,
  };
};
