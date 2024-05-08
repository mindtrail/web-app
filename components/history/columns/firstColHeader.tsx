import { Table } from '@tanstack/react-table'
import { Link1Icon } from '@radix-ui/react-icons'

import { CheckboxLarge } from '@/components/ui/checkbox-large'
import { Typography } from '@/components/typography'

import { getTableHeaders } from '@/lib/constants'

type FirstColHeadProps<TData> = {
  table: Table<TData>
  resourceType?: string
}

export function FirstColHeader<TData>({ table, resourceType }: FirstColHeadProps<TData>) {
  const columnName = getTableHeaders(resourceType).displayName

  return (
    <div className='flex items-center gap-2 px-2 group/saved-item'>
      <Link1Icon className='w-4 h-4 group-hover/saved-item:invisible' />
      <CheckboxLarge
        id='select-all'
        className='absolute left-0 hidden group-hover/saved-item:flex'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />

      <label
        htmlFor='select-all'
        className='hidden cursor-pointer group-hover/saved-item:flex'
      >
        <Typography>Select All</Typography>
      </label>

      <Typography className='group-hover/saved-item:hidden'>
        {getTableHeaders(resourceType).displayName}
      </Typography>
    </div>
  )
}
