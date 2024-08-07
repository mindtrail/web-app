import { Mention } from '@tiptap/extension-mention'
import { ReactRenderer, ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/react'
import tippy from 'tippy.js'
import { PluginKey } from 'prosemirror-state'

import { MentionsDropdown } from './mention-ui'
import { integrations, actions } from '@/lib/hooks/use-integrations'

function getIntegrationMentions(integrations: string[], editor: any) {
  integrations = integrations.map(
    (integration) => `${integration.toLowerCase()}${integration}`,
  )
  // Get @integration mentions that match the list of integrations + the query
  const regex = new RegExp(`${integrations.join('|')}`, 'i')
  console.log(editor.getText(), regex)
  let mentions =
    editor.getText().match(new RegExp(regex.source, 'gi')) || []

  return {
    mentions,
    lastMention: mentions[mentions.length - 1],
  }
}

const createMentionPopup = () => {
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
}

export const IntegrationMention = (char: string) =>
  Mention.extend({
    name: `integrationMention-${char}`,
  }).configure({
    HTMLAttributes: {
      class: 'mention integration-mention',
    },
    renderHTML({ node, options }) {
      return [
        'span',
        mergeAttributes(options.HTMLAttributes, {
          class: 'rounded-md px-2 py-1 bg-violet-50 text-violet-800 cursor-default',
        }),
        `${node.attrs.label ?? node.attrs.id}`,
      ]
    },
    suggestion: {
      char,
      pluginKey: new PluginKey(`integrationMention-${char}`),
      command: ({ editor, range, props }) => {
        editor
          .chain()
          .focus()
          .insertContentAt(
            range,
            [
              {
                type: `integrationMention-${char}`,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ],
          )
          .run()
      },
      items: ({ query }) => {
        return integrations
          .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      },
      render: createMentionPopup,
    },
  })

export const IntegrationActionMention = Mention.extend({
  name: 'integrationActionMention',
}).configure({
  HTMLAttributes: {
    class: 'mention integration-action-mention',
  },
  renderHTML({ node, options }) {
    return [
      'span',
      mergeAttributes(options.HTMLAttributes, {
        class: 'rounded-md px-2 py-1 bg-blue-50 text-blue-800 cursor-default',
      }),
      `${node.attrs.label ?? node.attrs.id}`,
    ]
  },
  suggestion: {
    char: '#',
    pluginKey: new PluginKey('integrationActionMention'),
    command: ({ editor, range, props }) => {
      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: 'integrationActionMention',
            attrs: props,
          },
          {
            type: 'text',
            text: ' ',
          },
        ])
        .run()
    },
    items: ({ query, editor }) => {
      const { lastMention } = getIntegrationMentions(integrations, editor)
      if (!lastMention) return []

      return actions[lastMention as keyof typeof actions]
        .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.label.localeCompare(b.label))
        .slice(0, 5)
        .map((item) => item.label)
    },
    render: createMentionPopup,
  },
})
