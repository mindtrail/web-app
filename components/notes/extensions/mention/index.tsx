import { Mention } from '@tiptap/extension-mention'
import { ReactRenderer } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/react'
import tippy from 'tippy.js'
import { PluginKey } from 'prosemirror-state'

import MentionList from './mentions-dropdown'

const createMentionPopup = () => {
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
}

export const UserMention = Mention.extend({
  name: 'userMention',
}).configure({
  HTMLAttributes: {
    class: 'mention user-mention',
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
    char: '@',
    pluginKey: new PluginKey('userMention'),
    command: ({ editor, range, props }) => {
      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: 'userMention',
            attrs: props,
          },
          {
            type: 'text',
            text: ' ',
          },
        ])
        .run()
    },
    items: ({ query }) => {
      const people = [
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
      ]
      return people
        .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5)
    },
    render: createMentionPopup,
  },
})

export const IntegrationMention = Mention.extend({
  name: 'integrationMention',
}).configure({
  HTMLAttributes: {
    class: 'mention integration-mention',
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
    pluginKey: new PluginKey('integrationMention'),
    command: ({ editor, range, props }) => {
      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: 'integrationMention',
            attrs: props,
          },
          {
            type: 'text',
            text: ' ',
          },
        ])
        .run()
    },
    items: ({ query }) => {
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
      ]
      return integrations
        .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5)
    },
    render: createMentionPopup,
  },
})
