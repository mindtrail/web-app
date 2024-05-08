import { supabase } from '@/lib/db/connection'

export function onFlowsChange(onChange: (payload: any) => void) {
  const channel = supabase
    .channel('custom-all-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'flows' }, onChange)
    .subscribe()
  return () => {
    channel.unsubscribe()
  }
}

export async function getFlows() {
  return supabase.from('flows').select('*').order('created_at', { ascending: true })
}

export async function createFlow(flow: any) {
  return supabase.from('flows').insert([flow])
}

export async function deleteFlow(id: string) {
  return supabase.from('flows').delete().match({ id })
}

export async function updateFlow(id: string, flow: any) {
  return supabase.from('flows').update(flow).match({ id })
}
