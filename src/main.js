import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

async function signUp() {
  const email = prompt('E-Mail eingeben')
  const password = prompt('Passwort eingeben (mind. 6 Zeichen)')

  if (!email || !password) return

  const { error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    alert('Registrierung fehlgeschlagen: ' + error.message)
  } else {
    alert('Registrierung erfolgreich. Jetzt einloggen.')
  }
}

async function signIn() {
  const email = prompt('E-Mail eingeben')
  const password = prompt('Passwort eingeben')

  if (!email || !password) return

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert('Login fehlgeschlagen: ' + error.message)
  } else {
    render()
  }
}

async function signOut() {
  await supabase.auth.signOut()
  render()
}

async function addEntry() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    alert('Bitte zuerst einloggen.')
    return
  }

  const { error } = await supabase.from('entries').insert([
    {
      user_id: user.id,
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

async function render() {
  const app = document.getElementById('app')
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    app.innerHTML = `
      <h1>Shooting Book App</h1>
      <button id="signupBtn">Registrieren</button>
      <button id="signinBtn">Einloggen</button>
    `
    document.getElementById('signupBtn').onclick = signUp
    document.getElementById('signinBtn').onclick = signIn
    return
  }

  app.innerHTML = `
    <h1>Shooting Book App</h1>
    <p>Eingeloggt als: ${user.email}</p>
    <button id="addEntryBtn">Test Eintrag speichern</button>
    <button id="signoutBtn">Ausloggen</button>
  `

  document.getElementById('addEntryBtn').onclick = addEntry
  document.getElementById('signoutBtn').onclick = signOut
}

render()
