import { Mention as MentionExtension } from '@tiptap/extension-mention'
import { ReactRenderer } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/react'
import tippy from 'tippy.js'

// You'll need to create this component or reuse the existing MentionsDropdown
import MentionsDropdown from './mentions-dropdown'

const mentionStyles = {
  class: 'rounded-md px-2 py-1 bg-blue-50 text-blue-800 cursor-default',
}

export const IntegrationMention = MentionExtension.configure({
  HTMLAttributes: {
    class: 'mention bg-secondary',
  },
  renderHTML({ options, node }) {
    return [
      'span',
      mergeAttributes(options.HTMLAttributes, mentionStyles),
      `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`,
    ]
  },
  suggestion: {
    char: '/',
    items: ({ query }: { query: string }) => {
      // List of integrations
      const integrations = [
        'Hubspot',
        'Salesforce',
        'Zapier',
        'Slack',
        'Trello',
        'Asana',
        'Jira',
        'GitHub',
        'GitLab',
        'Notion',
        // ... other integrations
      ]

      return integrations
        .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5)
    },
    render: () => {
      let component: ReactRenderer
      let popup: any

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionsDropdown, {
            props,
            editor: props.editor,
          })

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
            theme: 'light',
          })
        },
        onUpdate(props: any) {
          component.updateProps(props)

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        },
        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide()
            return true
          }

          return (component.ref as any)?.onKeyDown(props)
        },
        onExit() {
          popup[0].destroy()
          component.destroy()
        },
      }
    },
  },
})
