import {
  createReactInlineContentSpec,
  DefaultReactSuggestionItem,
} from '@blocknote/react'

// The Mention inline content.
export const HashTagSchema = createReactInlineContentSpec(
  {
    type: 'hashtag',
    propSchema: {
      tag: {
        default: 'Unknown',
      },
    },
    content: 'none',
  },
  {
    render: (props) => (
      <span style={{ backgroundColor: 'lightskyblue' }}>
        #{props.inlineContent.props.tag}
      </span>
    ),
  },
)

// Function which gets all tags for the mentions menu.
export const getHashtagsMenuItems = (editor: any): DefaultReactSuggestionItem[] => {
  const tags = ['ai', 'robots', 'cooool', 'memes']

  return tags.map((tag) => ({
    title: tag,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: 'hashtag',
          props: { tag },
        },
        ' ', // add a space after the mention
      ])
    },
  }))
}
