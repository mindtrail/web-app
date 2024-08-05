'use client'

import { gql, useQuery } from '@apollo/client'
import prismatic from '@prismatic-io/embedded'

export function useIntegrations(keyword: string) {
  const renderMarketplace = (marketplaceID: string) => {
    prismatic.showMarketplace({ selector: `#${marketplaceID}` })
  }

  const componentsRes = useQuery(gql`
    query getComponents {
      components(label_Icontains: "${keyword}") {
        nodes {
          key
          label
          description
        }
      }
    }
  `)

  return { renderMarketplace, components: componentsRes.data }
}
