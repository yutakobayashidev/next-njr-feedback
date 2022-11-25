/* eslint-disable @next/next/no-img-element */
import { config } from '@site.config'
import { MyPageSeo } from '@src/components/MyPageSeo'
import { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <MyPageSeo path='/' noTitleTemplate={true} noindex={true} />
      <section className='mx-auto bg-n-50 py-12 text-center'>
        <h1 className='mb-6 text-4xl font-bold'>議論&ナレッジ共有プラットフォーム</h1>
        <img
          className='mx-auto'
          alt='付箋を使ってミーティングを女性二人と男性2人のフラットイラスト'
          src='/mtg.png'
          height='450'
          width='450'
        ></img>
        <p className='text-lg text-gray-500'>{config.siteMeta.description}</p>
      </section>
    </>
  )
}

export default Page
