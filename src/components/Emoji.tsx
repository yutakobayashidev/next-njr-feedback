// 👏 Thanks https://zenn.dev/catnose99/articles/1e3925a010c3e5

import { memo } from "react"
import { parse } from "twemoji-parser"

type Props = {
  emoji: string
}

export const EmojiOrTwemoji: React.FC<Props> = memo(({ emoji }) => {
  return (
    <>
      <span className="twemoji">
        <span
          className="inline-flex h-[1em] w-[1em] bg-contain"
          style={{
            backgroundImage: `url(${getTwemojImgSrc(emoji)})`,
          }}
        />
      </span>
      <span className="native-emoji">{emoji}</span>
    </>
  )
})

function getTwemojImgSrc(emoji: string) {
  const entities = parse(emoji, {
    assetType: "svg",
    buildUrl: (codepoints, assetType) =>
      assetType === "png"
        ? `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${codepoints}.png`
        : `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codepoints}.svg`,
  })
  return entities.length === 0 ? null : entities[0].url
}

EmojiOrTwemoji.displayName = "Emoji"
