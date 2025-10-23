import { useState } from "react";
import { FORM_STATUS } from "../constants";
import { FormStatus } from "../types";

export const usePostTemplate = () => {
  const [formStatus, setFormStatus] = useState<FormStatus>(FORM_STATUS.IDLE);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus(FORM_STATUS.SUBMITTING);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setFormStatus(FORM_STATUS.SUCCESS);
        form.reset();

        if (typeof window !== "undefined" && (window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: "form_submit",
            form_name: form.getAttribute("name") || "unknown",
            page_path: window.location.pathname,
          });
        }
      } else {
        setFormStatus(FORM_STATUS.ERROR);
      }
    } catch {
      setFormStatus(FORM_STATUS.ERROR);
    }
  };

  const handleTagClick = (tag: string) => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "tag_click",
        tag_name: tag,
        page_path: window.location.pathname,
      });
    }
  };

  return { formStatus, handleSubmit, handleTagClick };
};
