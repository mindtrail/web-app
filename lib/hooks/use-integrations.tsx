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

export const integrations = ['Hubspot', 'Salesforce', 'Slack', 'Notion', 'Calendly']

export const actions = {
  hubspotHubspot: [
    {
      label: 'List Deals',
    },
    {
      label: 'Create Deal',
    },
    {
      label: 'Get Deal',
    },
    {
      label: 'Update Deal',
    },
    {
      label: 'Delete Deal',
    },
    {
      label: 'Search Deals',
    },
    {
      label: 'Create Product',
    },
    {
      label: 'Update Product',
    },
    {
      label: 'List Products',
    },
    {
      label: 'Get Product',
    },
    {
      label: 'Delete Product',
    },
    {
      label: 'List Contacts',
    },
    {
      label: 'Create Contact',
    },
    {
      label: 'Delete Contact',
    },
    {
      label: 'Get Contact',
    },
    {
      label: 'Update Contact',
    },
    {
      label: 'List Companies',
    },
    {
      label: 'Create Company',
    },
    {
      label: 'Delete Company',
    },
    {
      label: 'Update Company',
    },
    {
      label: 'Get Company',
    },
    {
      label: 'List Line Items',
    },
    {
      label: 'Get Line Item',
    },
    {
      label: 'Create Line Item',
    },
    {
      label: 'Delete Line Item',
    },
    {
      label: 'Update Line Item',
    },
    {
      label: 'List Association Types',
    },
    {
      label: 'Create Association',
    },
    {
      label: 'Archive Association',
    },
    {
      label: 'Read Association',
    },
    {
      label: 'List Webhooks',
    },
    {
      label: 'Create Webhook',
    },
    {
      label: 'Delete Webhook',
    },
    {
      label: 'Delete all Instanced Webhooks',
    },
    {
      label: 'List Properties',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'Get Current User',
    },
    {
      label: 'Validate Connection',
    },
    {
      label: 'Get Custom Object',
    },
    {
      label: 'Create Custom Object',
    },
    {
      label: 'Update Custom Object',
    },
    {
      label: 'Delete Custom Object',
    },
    {
      label: 'List Custom Objects',
    },
    {
      label: 'Import CRM Data',
    },
    {
      label: 'List Active Imports',
    },
    {
      label: 'Cancel Import',
    },
    {
      label: 'Get an Import',
    },
    {
      label: 'Export CRM Data',
    },
    {
      label: 'Search',
    },
    {
      label: 'List Engagements',
    },
    {
      label: 'Get Engagement',
    },
    {
      label: 'Create Engagement',
    },
    {
      label: 'Update Engagement',
    },
    {
      label: 'Delete Engagement',
    },
    {
      label: 'Create Batch Engagement',
    },
    {
      label: 'Update Batch Engagement',
    },
    {
      label: 'Archive Batch Engagement',
    },
    {
      label: 'Archive Batch Contacts',
    },
    {
      label: 'Create Batch Contacts',
    },
    {
      label: 'Get Batch Contacts',
    },
    {
      label: 'Update Batch Contacts',
    },
    {
      label: 'Webhook',
    },
    {
      label: 'Event Type Subscription',
    },
    {
      label: 'Object Selection',
    },
  ],
  salesSalesforce: [
    {
      label: 'Salesforce Query',
    },
    {
      label: 'Create Record',
    },
    {
      label: 'Update Record',
    },
    {
      label: 'Delete Record',
    },
    {
      label: 'Delete Account',
    },
    {
      label: 'Add Attachment',
    },
    {
      label: 'Upsert Record',
    },
    {
      label: 'Create Lead',
    },
    {
      label: 'Delete Lead',
    },
    {
      label: 'Create Account',
    },
    {
      label: 'Update Account',
    },
    {
      label: 'Update Lead',
    },
    {
      label: 'Create Customer',
    },
    {
      label: 'Delete Customer',
    },
    {
      label: 'Update Customer',
    },
    {
      label: 'Describe Customer SObject',
    },
    {
      label: 'Get Customer',
    },
    {
      label: 'List Customers',
    },
    {
      label: 'Create Contact',
    },
    {
      label: 'Delete Contact',
    },
    {
      label: 'Update Contact',
    },
    {
      label: 'Create Opportunity',
    },
    {
      label: 'Delete Opportunity',
    },
    {
      label: 'Update Opportunity',
    },
    {
      label: 'Find Record',
    },
    {
      label: 'Find Records',
    },
    {
      label: 'Get Record',
    },
    {
      label: 'Create User',
    },
    {
      label: 'Update User',
    },
    {
      label: 'Add User Permission Set',
    },
    {
      label: 'Remove User Permission Set',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'Get Current User',
    },
    {
      label: 'Validate Connection',
    },
    {
      label: 'Get Attachment',
    },
    {
      label: 'Send Transactional Email',
    },
    {
      label: 'List Workflow Rules',
    },
    {
      label: 'Create Workflow Rule',
    },
    {
      label: 'Delete Workflow Rule',
    },
    {
      label: 'List Workflow Outbound Messages',
    },
    {
      label: 'Create Workflow Outbound Message',
    },
    {
      label: 'Delete Workflow Outbound Message',
    },
    {
      label: 'Subscribe to Record Change',
    },
    {
      label: 'Create Profile',
    },
    {
      label: 'Update Profile',
    },
    {
      label: 'Delete Profile',
    },
    {
      label: 'Describe Object',
    },
    {
      label: 'Describe Permissions',
    },
    {
      label: 'Metadata API: Create Fields',
    },
    {
      label: 'Metadata API: Create Objects',
    },
    {
      label: 'Metadata API: Read Metadata of Object',
    },
    {
      label: 'Metadata API: List Object Metadata',
    },
    {
      label: 'Bulk Insert Records',
    },
    {
      label: 'Bulk Upsert Records',
    },
    {
      label: 'Get File',
    },
    {
      label: 'Upload File',
    },
    {
      label: 'Composite Requests',
    },
    {
      label: 'List Composite Resources',
    },
    {
      label: 'Abort a Bulk Query Job',
    },
    {
      label: 'Create Bulk Query Job',
    },
    {
      label: 'Delete A Bulk Query Job',
    },
    {
      label: 'Get Information About All Query Jobs',
    },
    {
      label: 'Get Information About a Bulk Query Job',
    },
    {
      label: 'Get Results for a Bulk Query Job',
    },
    {
      label: 'Abort a Bulk Job',
    },
    {
      label: 'Complete Upload Bulk Job',
    },
    {
      label: 'Create a Bulk Job',
    },
    {
      label: 'Delete a Bulk Job',
    },
    {
      label: 'List Bulk Jobs',
    },
    {
      label: 'Get Bulk Job Info',
    },
    {
      label: 'Upload Bulk Job Data',
    },
    {
      label: 'Get Bulk Job Failed Record Results',
    },
    {
      label: 'Get Bulk Job Successful Record Results',
    },
    {
      label: 'Webhook',
    },
    {
      label: 'Workflow Outbound Message Webhook',
    },
    {
      label: 'Record Types With Fields',
    },
    {
      label: 'Record Type Field Value Preview',
    },
    {
      label: 'Record Type Field Preview',
    },
    {
      label: 'Record Types',
    },
    {
      label: 'Record Type Fields',
    },
  ],
  slackSlack: [
    {
      label: 'Post Message',
    },
    {
      label: 'Delete message',
    },
    {
      label: 'Delete a pending scheduled message',
    },
    {
      label: 'Update Message',
    },
    {
      label: 'Post Ephemeral Message',
    },
    {
      label: 'Close Conversation',
    },
    {
      label: 'Create Conversation',
    },
    {
      label: 'Rename Conversation',
    },
    {
      label: 'Get User By Email',
    },
    {
      label: 'Get User By ID',
    },
    {
      label: 'Leave Conversations',
    },
    {
      label: 'List Conversations',
    },
    {
      label: 'List Conversation Members',
    },
    {
      label: 'List Users',
    },
    {
      label: 'Slack Message From Webhook',
    },
    {
      label: 'Post Block Message',
    },
    {
      label: 'Slack Block Message From Webhook',
    },
    {
      label: 'Archive Conversation',
    },
    {
      label: 'Conversation Exists',
    },
    {
      label: 'List Scheduled Messages',
    },
    {
      label: 'List Files',
    },
    {
      label: 'Invite User To Conversation',
    },
    {
      label: 'Set Conversation Purpose',
    },
    {
      label: 'Set Conversation Topic',
    },
    {
      label: 'List Users Conversations',
    },
    {
      label: 'Upload File',
    },
    {
      label: 'Get Conversation History',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'Search All',
    },
    {
      label: 'Search Files',
    },
    {
      label: 'Search Messages',
    },
    {
      label: 'Events API Webhook',
    },
    {
      label: 'App Webhook',
    },
    {
      label: 'Select Channel',
    },
    {
      label: 'Select User',
    },
  ],
  'Google Sheets': [
    {
      label: 'Add Worksheet',
    },
    {
      label: 'Append Rows',
    },
    {
      label: 'Clear Worksheet',
    },
    {
      label: 'Create Spreadsheet',
    },
    {
      label: 'List Rows',
    },
    {
      label: 'List Columns',
    },
    {
      label: 'List Worksheets',
    },
    {
      label: 'Remove Worksheet',
    },
    {
      label: 'Set Header Row',
    },
    {
      label: 'Update Rows',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'Select Column',
    },
    {
      label: 'Select Worksheet',
    },
  ],
  notionNotion: [
    {
      label: 'Create Database',
    },
    {
      label: 'Create Database Item',
    },
    {
      label: 'Get Database',
    },
    {
      label: 'List Databases',
    },
    {
      label: 'Query Database',
    },
    {
      label: 'Get Page',
    },
    {
      label: 'List Pages',
    },
    {
      label: 'Create Page',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'Get Current User',
    },
    {
      label: 'Get User by ID',
    },
    {
      label: 'List Users',
    },
  ],
  calendlyCalendly: [
    {
      label: 'List User Availability Schedules',
    },
    {
      label: "Revoke User's Organization Invitation",
    },
    {
      label: 'Get User Availability Schedule',
    },
    {
      label: 'Select Organization Membership',
    },
    {
      label: 'List Webhook Subscription',
    },
    {
      label: 'List Activity Log Entries',
    },
    {
      label: 'Delete Invitee Data',
    },
    {
      label: 'Get Current User',
    },
    {
      label: 'List Organization Invitations',
    },
    {
      label: 'Get Routing Form Submission',
    },
    {
      label: 'Create Webhook Subscription',
    },
    {
      label: 'Get Organization Membership',
    },
    {
      label: 'Cancel Event',
    },
    {
      label: 'Select Event Type',
    },
    {
      label: 'Get Webhook Subscription',
    },
    {
      label: 'List User Busy Times',
    },
    {
      label: 'Get Event Type',
    },
    {
      label: 'Get Event Invitee',
    },
    {
      label: 'Select Event',
    },
    {
      label: 'Get Routing Form',
    },
    {
      label: 'Invite User to Organization',
    },
    {
      label: 'List Event Invitees',
    },
    {
      label: 'Create Share',
    },
    {
      label: 'Get User',
    },
    {
      label: 'List Routing Forms',
    },
    {
      label: 'List Organization Memberships',
    },
    {
      label: 'Create Single-Use Scheduling Link',
    },
    {
      label: "List User's Event Types",
    },
    {
      label: 'Delete Webhook Subscription',
    },
    {
      label: 'List Routing Form Submissions',
    },
    {
      label: 'Scheduled Event',
    },
    {
      label: 'Remove User from Organization',
    },
    {
      label: 'Get Event',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'Select Routing Form',
    },
    {
      label: 'List Events',
    },
    {
      label: 'Get Organization Invitation',
    },
    {
      label: 'List Event Type Available Times',
    },
    {
      label: 'Delete Scheduled Event Data',
    },
    {
      label: 'Delete Instanced Webhooks',
    },
  ],
  Gmail: [
    {
      label: 'Get Label by Name',
    },
    {
      label: 'List Labels',
    },
    {
      label: 'Get Message',
    },
    {
      label: 'List Messages',
    },
    {
      label: 'Send Message',
    },
    {
      label: 'Trash Message',
    },
    {
      label: 'Untrash Message',
    },
    {
      label: 'Update Message Labels',
    },
    {
      label: 'Get Current User',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'Create Push Notification (Watch Request)',
    },
    {
      label: 'Delete Push Notification (Stop Mailbox Updates)',
    },
    {
      label: 'Get Event History',
    },
    {
      label: 'Push Notification Webhook',
    },
  ],
  'Google Calendar': [
    {
      label: 'Delete Event',
    },
    {
      label: 'Create Event',
    },
    {
      label: 'Get Calendar',
    },
    {
      label: 'Delete Calendar',
    },
    {
      label: 'Create Calendar',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'List Events',
    },
    {
      label: 'Get Event',
    },
    {
      label: 'List Calendars',
    },
    {
      label: 'Calendars',
    },
    {
      label: 'Update Event',
    },
  ],
  'Google Drive': [
    {
      label: 'Get About',
    },
    {
      label: 'Get File',
    },
    {
      label: 'Create File',
    },
    {
      label: 'List Files',
    },
    {
      label: 'Copy File',
    },
    {
      label: 'Update File',
    },
    {
      label: 'Delete File',
    },
    {
      label: 'Empty Trash',
    },
    {
      label: 'Create Folder',
    },
    {
      label: 'List Folders',
    },
    {
      label: 'Raw Request',
    },
    {
      label: 'Search Folders',
    },
    {
      label: "List File's Export Types",
    },
    {
      label: 'Search Files',
    },
    {
      label: 'List Drives',
    },
    {
      label: 'List Changes',
    },
    {
      label: 'Create Webhook for Drive',
    },
    {
      label: 'Create Webhook for File or Folder',
    },
    {
      label: 'Delete Webhook',
    },
    {
      label: 'Get Current User',
    },
    {
      label: 'Move File',
    },
    {
      label: 'Push Notification Webhook',
    },
    {
      label: 'Select Drive',
    },
    {
      label: 'List Folders',
    },
    {
      label: 'List Files',
    },
  ],
}
