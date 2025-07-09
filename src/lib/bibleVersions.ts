export interface BibleVersion {
  module: string;
  shortname: string;
  name: string;
}

export const bibleVersions: BibleVersion[] = [
  { module: "asv", shortname: "ASV", name: "American Standard Version" },
  { module: "asvs", shortname: "ASVs", name: "American Standard Version w Strong's" },
  { module: "bishops", shortname: "Bishops", name: "Bishops Bible" },
  { module: "coverdale", shortname: "Coverdale", name: "Coverdale Bible" },
  { module: "geneva", shortname: "Geneva", name: "Geneva Bible" },
  { module: "kjv", shortname: "KJV", name: "Authorized King James Version" },
  { module: "kjv_strongs", shortname: "KJV Strongs", name: "KJV with Strongs" },
  { module: "net", shortname: "NET", name: "NET Bible\u00ae" },
  { module: "tyndale", shortname: "Tyndale", name: "Tyndale Bible" },
  { module: "web", shortname: "WEB", name: "World English Bible" },
  {
    module: "niv_api",
    shortname: "NIV (API)",
    name: "New International Version via API.Bible",
  },
];
