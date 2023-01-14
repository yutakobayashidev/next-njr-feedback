import { config } from "@site.config"
import NextHeadSeo from "next-head-seo"

// types
export type MyPageSeoProps = {
  title?: string
  description?: string
  noindex?: boolean
  noTitleTemplate?: boolean
  ogImagePath?: string
  path: string
}

export const MyPageSeo: React.FC<MyPageSeoProps> = (props) => {
  const {
    title = config.siteMeta.title,
    description = config.siteMeta.description,
    noindex,
    noTitleTemplate,
    ogImagePath = "/default-og.png",
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
      customLinkTags={[
        {
          href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>😸</text></svg>",
          rel: "icon",
        },
      ]}
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
