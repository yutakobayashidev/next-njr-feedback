export const config = {
  siteMeta: {
    title: "Next NJR Feedback",
    description:
      "Next NJR Feedback (仮)はN中等部のSlackワークスペースに参加している生徒またはスタッフが使用できる議論&ナレッジ共有プラットフォームです。",
  },
  siteRoot:
    process.env.NODE_ENV === "production"
      ? "https://njr-feedback.vercel.app"
      : "http://localhost:3000",
}
