import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/typography'

export function HistoryBreadcrumbs() {
  const pathname = usePathname()
  return (
    <div className='flex justify-between items-center'>
      <Typography variant='h5'>
        {pathname === '/history' ? 'All Items' : '123'}
      </Typography>
    </div>
  )
}
