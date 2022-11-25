export const ContentWrapper: React.FC<{ children: React.ReactNode }> = (props) => {
  return <div className='mx-auto max-w-screen-xl px-4 md:px-8'>{props.children}</div>
}
