import { API, useApi } from "./useApi";

// One page of terms. Without `domain` the search covers all domains (global
// search); an empty `word` means "everything" (word=*).
export const useTerms = ({ domain, word, page }) => {
  const params = new URLSearchParams({ search_type: "5", word: word || "*" });
  if (domain) params.set("domain", domain);
  params.set("page", page);

  const { data, loading, error, retry } = useApi(`${API}/web/terms?${params}`);

  return {
    terms: Array.isArray(data?.data) ? data.data : [],
    pagination: data?.meta?.pagination ?? null,
    loading,
    error,
    retry,
  };
};
