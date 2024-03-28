import {
  createReactInlineContentSpec,
  DefaultReactSuggestionItem,
} from '@blocknote/react'

// The Mention inline content.
export const MentionSchema = createReactInlineContentSpec(
  {
    type: 'mention',
    propSchema: {
      user: {
        default: 'Unknown',
      },
    },
    content: 'none',
  },
  {
    render: (props) => (
      <span style={{ backgroundColor: '#8400ff33' }}>
        @{props.inlineContent.props.user}
      </span>
    ),
  },
)

// Function which gets all users for the mentions menu.
export const getMentionMenuItems = (editor: any): DefaultReactSuggestionItem[] => {
  const users = ['Steve', 'Bob', 'Joe', 'Mike']

  return users.map((user) => ({
    title: user,
    onItemClick: () => {
      editor.insertInlineContent([
        {
          type: 'mention',
          props: { user },
        },
        ' ', // add a space after the mention
      ])
    },
  }))
}
