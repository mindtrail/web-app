'use client'

import { useEffect } from 'react'
import { useIntegrations } from '@/lib/hooks/use-integrations'

const marketplaceID = 'marketplace'

export default function Prismatic() {
  const { components, renderMarketplace } = useIntegrations('Slack')
  console.log(components)

  useEffect(() => {
    renderMarketplace(marketplaceID)
  }, [renderMarketplace])

  return (
    <>
      <div className='max-h-full flex-1 space-y-4 overflow-auto p-4 pt-6 md:p-8'>
        <div className='h-[700px] w-full' id={marketplaceID}></div>
      </div>
    </>
  )
}
