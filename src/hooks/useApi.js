import { useEffect, useState } from "react";

export const API = "https://apithesaurus.isca.ac.ir/v1";
export const DOMAINS_URL = `${API}/domains`;

// One shared promise per URL. Identical requests (Header and Home both asking
// for the domains, or returning to a page that was already opened) are sent
// only once. A failed request is forgotten, so "retry" really asks again.
const requests = new Map();

const fetchJson = (url) => {
  if (!requests.has(url)) {
    requests.set(
      url,
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .catch((error) => {
          requests.delete(url);
          throw error;
        }),
    );
  }
  return requests.get(url);
};

export const useApi = (url) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null });
  // The answer on screen belongs to one `key`. If the url changes, `key` changes
  // and we are "loading" until the matching answer arrives, so an old answer
  // can never be shown for a new url.
  const key = `${url}|${reloadKey}`;

  useEffect(() => {
    let active = true; // becomes false when the url changes or the page closes
    fetchJson(url)
      .then((data) => {
        if (active) setResult({ key, data });
      })
      .catch((error) => {
        if (!active) return;
        console.error(error, url);
        setResult({ key, error: true });
      });
    return () => {
      active = false;
    };
  }, [url, key]);

  const loading = result.key !== key;

  return {
    data: loading ? null : (result.data ?? null),
    loading,
    error: !loading && Boolean(result.error),
    retry: () => setReloadKey((k) => k + 1),
  };
};
