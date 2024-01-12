import { UserConfig } from "rspress/config";

const nav: UserConfig["themeConfig"]["nav"] = [];

const socialLinks: UserConfig["themeConfig"]["socialLinks"] = [
  {
    mode: "link",
    icon: "github",
    content: "https://github.com/sqius",
  },
];
const themeConfig: UserConfig["themeConfig"] = {
  lastUpdated: true,
  outlineTitle: "目录",
  prevPageText: "上一篇",
  nextPageText: "下一篇",
  lastUpdatedText: "上次更新时间",
  footer: { message: "最好的时间是当下" },
  enableContentAnimation: true,
  socialLinks,
};

export default themeConfig;
