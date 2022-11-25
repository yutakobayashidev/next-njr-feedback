import { config } from '@site.config'
import { ContentWrapper } from '@src/components/ContentWrapper'
import Link from 'next/link'

export const SiteHeader: React.FC = () => (
  <header className='border-b border-gray-200'>
    <ContentWrapper>
      <div className='flex h-14 items-center justify-between'>
        <Link href='/' className='font-bold text-n'>
          {config.siteMeta.title}
        </Link>
        <button className='center rounded-md bg-n px-4 py-2 font-bold text-white shadow-sm hover:opacity-90 '>
          サインイン
        </button>
      </div>
    </ContentWrapper>
  </header>
)
