import { config } from "@site.config"
import { MyPageSeoProps } from "@src/types"
import NextHeadSeo from "next-head-seo"

export const MyPageSeo: React.FC<MyPageSeoProps> = (props) => {
  const {
    title = config.siteMeta.title,
    description = config.siteMeta.description,
    noindex,
    noTitleTemplate,
    ogImagePath = "/ogimage.jpg",
    path,
  } = props

  // Set APP_ROOT_URL on enviroment variables
  // e.g. APP_ROOT_URL=https://example.com
  // https://nextjs.org/docs/basic-features/environment-variables
  const APP_ROOT_URL = config.siteRoot

  // Absolute page url
  const pageUrl = APP_ROOT_URL + path
  // Absolute og image url
  const ogImageUrl = APP_ROOT_URL + ogImagePath

  return (
    <NextHeadSeo
      title={noTitleTemplate ? title : `${title} | Next NJR Feedback`}
      canonical={pageUrl}
      description={description}
      robots={noindex ? "noindex, nofollow" : undefined}
      og={{
        title,
        description,
        image: ogImageUrl,
        siteName: config.siteMeta.title,
        type: "article",
        url: pageUrl,
      }}
      twitter={{
        card: "summary_large_image",
      }}
    />
  )
}
