import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

type TagsProps = {
  columnSize: number
  tagList: DataSourceTag[]
}

export const TagsCell = ({ columnSize, tagList }: TagsProps) => {
  return (
    <ScrollArea className={`flex-1 relative flex flex-col gap-1 max-h-[150px]`}>
      <div className={`flex flex-wrap gap-2 px-2 max-w-[${columnSize}px] `}>
        {tagList?.length
          ? tagList.map(({ tag }, index) => (
              <Button
                key={index}
                variant='outline'
                size='sm'
                className={`max-w-full h-auto py-1 min-h-8`}
              >
                {tag.name}
              </Button>
            ))
          : 'No tags'}
      </div>
    </ScrollArea>
  )
}
