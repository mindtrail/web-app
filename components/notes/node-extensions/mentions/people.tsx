import { Mention as MentionExtension } from '@tiptap/extension-mention'
import { ReactRenderer } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/react'
import tippy from 'tippy.js'

// You'll need to create this component
import MentionList from './mentions-dropdown'

const mentionStyles = {
  class: 'rounded-md px-2 py-1 bg-violet-50 text-violet-800 cursor-default',
}

export const PeopleMention = MentionExtension.configure({
  HTMLAttributes: {
    class: 'mention bg-primary',
  },
  renderHTML({ options, node }) {
    console.log('options', options)
    console.log('node', node)
    return [
      'span',
      mergeAttributes(options.HTMLAttributes, mentionStyles),
      `${options.suggestion.char} ${node.attrs.label ?? node.attrs.id}`,
    ]
  },
  // deleteTriggerWithBackspace: true,
  suggestion: {
    items: ({ query }: { query: string }) => {
      // This is where you'd fetch your list of connections
      return [
        'Alin',
        'Alex',
        'Andrei',
        'Cristian',
        'Doru',
        'Eugen',
        'Ionut',
        'Mihai',
        'Radu',
        'Valeriu',
        // ... other connections
      ]
        .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5)
    },
    render: () => {
      let component: ReactRenderer
      let popup: any

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
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
