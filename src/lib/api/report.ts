import { IncomingWebhook } from "@slack/webhook"

const slack = {
  sendToSlack: async (text: string) => {
    const url = process.env.SLACK_WEBHOOK_URL as string
    const webhook = new IncomingWebhook(url)
    await webhook.send({ icon_emoji: ":warning:", text, username: "違反報告フォーム" })
  },
}

export default slack
