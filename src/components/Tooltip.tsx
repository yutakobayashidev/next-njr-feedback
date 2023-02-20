import { memo, ReactNode, useRef } from "react"

type Props = {
  children: ReactNode
  text: string
}
export const Tooltip: React.FC<Props> = memo((props) => {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseEnter = () => {
    if (!ref.current) return
    ref.current.style.opacity = "1"
    ref.current.style.visibility = "visible"
  }
  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.opacity = "0"
    ref.current.style.visibility = "hidden"
  }

  return (
    <div className="relative flex items-center">
      <div
        className="invisible absolute top-full left-1/2 z-10 mx-auto mt-2 flex -translate-x-1/2 items-center whitespace-nowrap rounded-lg bg-black py-[4px] px-2 text-xs text-white transition-all duration-150 before:absolute before:-top-1 before:left-1/2 before:z-0 before:block before:h-2 before:w-2 before:-translate-x-1/2 before:rotate-45 before:bg-black"
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.text}
      </div>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {props.children}
      </div>
    </div>
  )
})

Tooltip.displayName = "Tooltip"
