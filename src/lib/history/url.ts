const AMAZON_MATCHER = /^https?:\/\/(www\.)?amazon\.com/;
const AMAZON_QUERY_PARAMETER_TH_MATCHER = /&?th=\d/;
// Identifies '+' seperators in query parameters specific to Amazon search, e.g.
// the regex will match two '+' instances in
// https://www.amazon.com/VASAGLE-Standing-.../ref=sr_1_24?keywords=standing+coat+rack&qid=1684638455...sr=1-24
const AMAZON_SEARCH_PLUS_SEPERATOR_MATCHER =
  /(?<=(keywords|sprefix)=[^&#]*)\+/g;
const GOOGLE_DOCS_MATCHER = /^https?:\/\/docs.google.com/;
const GOOGLE_WORKSPACE_USER_PATH_SEGMENTS_MATCHER = /\/u\/\d+\/d/;
const NOTION_MATCHER = /^https?:\/\/(www\.)?notion\.so/;
const TRAILING_EXTRA_CHARACTER_MATCHER = /(\/|\?)$/;
const QUERY_STRING_MATCHER = /\?.*$/;

export function normalizeUrl(url: string) {
  // remove hashes that are not followed by a slash (some frameworks use a
  // /#/path/to/resource format)
  // First replace hash anchors followed by query strings
  url = url.replace(/#[^/]*(?=\?)/, "");
  // Then replace any hash anchors not followed by query strings
  url = url.replace(/#[^/]*$/, "");

  if (url.match(AMAZON_MATCHER)) {
    url = normalizeAmazon(url);
  }

  if (url.match(NOTION_MATCHER)) {
    url = normalizeNotion(url);
  }

  if (url.match(GOOGLE_DOCS_MATCHER)) {
    url = normalizeGoogleDocs(url);
  }

  // strip any unnecessary trailing characters.
  url = url.replace(TRAILING_EXTRA_CHARACTER_MATCHER, "");

  return url;
}

function normalizeAmazon(url: string) {
  // strip "&th=\d" query parameter.
  url = url.replace(AMAZON_QUERY_PARAMETER_TH_MATCHER, "");
  // replace "+" with " " in search query parameters.
  url = url.replace(AMAZON_SEARCH_PLUS_SEPERATOR_MATCHER, "%2B");

  return url;
}

function normalizeGoogleDocs(url: string) {
  // strip query string
  url = url.replace(QUERY_STRING_MATCHER, "");

  // strip the user elements
  url = url.replace(GOOGLE_WORKSPACE_USER_PATH_SEGMENTS_MATCHER, "/d");

  return url;
}

function normalizeNotion(url: string) {
  // strip query string
  url = url.replace(QUERY_STRING_MATCHER, "");
  // strip any unnecessary trailing characters before next step
  url = url.replace(TRAILING_EXTRA_CHARACTER_MATCHER, "");

  // now we need to normalize URLs that have the slug, and those that don't
  const hyphenId = url.match(/-[a-zA-Z0-9]*$/);
  if (hyphenId) {
    const id = hyphenId[0].substring(1);
    url = url.replace(/\/[^/]*$/, `/${id}`);
  }

  return url;
}
