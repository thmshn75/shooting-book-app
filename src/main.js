import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

window.addEntry = async function () {
  const { error } = await supabase.from('entries').insert([
    {
      entry_date: new Date().toISOString().split('T')[0],
      entry_type: 'training',
      total_score: 100
    }
  ])

  if (error) {
    alert('Fehler: ' + error.message)
  } else {
    alert('Eintrag gespeichert!')
  }
}
