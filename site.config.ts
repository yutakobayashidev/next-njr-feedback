export const config = {
  footerLinks: [
    {
      title: "ガイドライン",
      href: "/guideline",
    },
    {
      title: "プライバシーポリシー",
      href: "/privacy",
    },
    {
      title: "クレジット・ライセンス",
      href: "/licence",
    },
  ],
  siteMeta: {
    title: "Next NJR Feedback",
    description:
      "Next NJR FeedbackはN中等部の生徒、メンター・TAが使用できる議論&ナレッジ共有プラットフォームです。",
    repository: "https://github.com/yutakobayashidev/next-njr-feedback",
    slack: "https://n-jr.slack.com/archives/C04LXFN1PGC",
  },
  siteRoot:
    process.env.NODE_ENV === "production"
      ? "https://njr-feedback.vercel.app"
      : "http://localhost:3000",
}
