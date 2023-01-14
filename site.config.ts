export const config = {
  siteMeta: {
    title: "Next NJR Feedback",
    description:
      "Next NJR FeedbackはN中等部の生徒またはメンター・TAなどが使用できる議論&ナレッジ共有プラットフォームです。",
    repository: "https://github.com/yutakobayashidev/next-njr-feedback",
  },
  siteRoot:
    process.env.NODE_ENV === "production"
      ? "https://njr-feedback.vercel.app"
      : "http://localhost:3000",
}
