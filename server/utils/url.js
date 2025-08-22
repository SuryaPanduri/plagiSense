// server/utils/url.js
export function canonicalize(url) {
    try {
      const u = new URL(url);
      u.hash = "";
      ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"]
        .forEach(p => u.searchParams.delete(p));
      return u.toString();
    } catch {
      return url;
    }
  }
  
  export function domainLabel(url) {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  }