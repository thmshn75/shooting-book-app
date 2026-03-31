import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uvgqbnsexnwrqkxrsxib.supabase.co'
const supabaseKey = 'sb_publishable_X0J-88ZYBNSy4HWNHyF56Q_xWCD40ex'
const supabase = createClient(supabaseUrl, supabaseKey)

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Shooting Book</h1>

    <div id="auth-box">
      <h2>Login / Registrierung</h2>
      <input id="email" type="email" placeholder="E-Mail" />
      <input id="password" type="password" placeholder="Passwort" />
      <div class="row">
        <button id="register-btn">Registrieren</button>
        <button id="login-btn">Login</button>
        <button id="logout-btn" style="display:none;">Logout</button>
      </div>
      <p id="auth-status"></p>
    </div>

    <hr />

    <div id="entry-box" style="display:none;">
      <h2>Neuer Eintrag</h2>
      <div class="form-grid">
        <input id="entry-date" type="date" />
        <input id="entry-type" type="text" placeholder="Typ (z. B. Training / Wettkampf)" />
        <input id="entry-location" type="text" placeholder="Ort" />
        <input id="entry-note" type="text" placeholder="Notiz" />
      </div>
      <button id="save-entry-btn">Eintrag speichern</button>
      <p id="entry-status"></p>
    </div>

    <hr />

    <div id="list-box" style="display:none;">
      <h2>Meine Einträge</h2>
      <button id="reload-btn">Liste aktualisieren</button>
      <div id="entries-list"></div>
    </div>
  </div>
`

const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const registerBtn = document.getElementById('register-btn')
const loginBtn = document.getElementById('login-btn')
const logoutBtn = document.getElementById('logout-btn')
const authStatus = document.getElementById('auth-status')

const entryBox = document.getElementById('entry-box')
const listBox = document.getElementById('list-box')
const entryDate = document.getElementById('entry-date')
const entryType = document.getElementById('entry-type')
const entryLocation = document.getElementById('entry-location')
const entryNote = document.getElementById('entry-note')
const saveEntryBtn = document.getElementById('save-entry-btn')
const entryStatus = document.getElementById('entry-status')
const reloadBtn = document.getElementById('reload-btn')
const entriesList = document.getElementById('entries-list')

function showLoggedInUI() {
  entryBox.style.display = 'block'
  listBox.style.display = 'block'
  logoutBtn.style.display = 'inline-block'
  loginBtn.style.display = 'none'
  registerBtn.style.display = 'none'
}

function showLoggedOutUI() {
  entryBox.style.display = 'none'
  listBox.style.display = 'none'
  logoutBtn.style.display = 'none'
  loginBtn.style.display = 'inline-block'
  registerBtn.style.display = 'inline-block'
  entriesList.innerHTML = ''
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('de-AT')
}

async function loadEntries() {
  entriesList.innerHTML = '<p>Lade Einträge...</p>'

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    entriesList.innerHTML = '<p>Kein Benutzer eingeloggt.</p>'
    return
  }

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    entriesList.innerHTML = `<p>Fehler beim Laden: ${error.message}</p>`
    return
  }

  if (!data || data.length === 0) {
    entriesList.innerHTML = '<p>Noch keine Einträge vorhanden.</p>'
    return
  }

  entriesList.innerHTML = data
    .map(
      (entry) => `
        <div class="entry-card">
          <div><strong>Datum:</strong> ${formatDate(entry.entry_date)}</div>
          <div><strong>Typ:</strong> ${entry.entry_type || '-'}</div>
          <div><strong>Ort:</strong> ${entry.location || '-'}</div>
          <div><strong>Notiz:</strong> ${entry.note || '-'}</div>
        </div>
      `
    )
    .join('')
}

registerBtn.addEventListener('click', async () => {
  authStatus.textContent = 'Registrierung läuft...'

  const { error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value,
  })

  if (error) {
    authStatus.textContent = `Fehler: ${error.message}`
    return
  }

  authStatus.textContent = 'Registrierung erfolgreich. Bitte E-Mail bestätigen, falls aktiviert.'
})

loginBtn.addEventListener('click', async () => {
  authStatus.textContent = 'Login läuft...'

  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  })

  if (error) {
    authStatus.textContent = `Fehler: ${error.message}`
    return
  }

  authStatus.textContent = 'Login erfolgreich.'
  showLoggedInUI()
  await loadEntries()
})

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut()
  authStatus.textContent = 'Ausgeloggt.'
  showLoggedOutUI()
})

saveEntryBtn.addEventListener('click', async () => {
  entryStatus.textContent = 'Speichere Eintrag...'

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    entryStatus.textContent = 'Nicht eingeloggt.'
    return
  }

  const { error } = await supabase.from('entries').insert([
    {
      user_id: user.id,
      entry_date: entryDate.value || null,
      entry_type: entryType.value || null,
      location: entryLocation.value || null,
      note: entryNote.value || null,
    },
  ])

  if (error) {
    entryStatus.textContent = `Fehler: ${error.message}`
    return
  }

  entryStatus.textContent = 'Eintrag gespeichert.'

  entryDate.value = ''
  entryType.value = ''
  entryLocation.value = ''
  entryNote.value = ''

  await loadEntries()
})

reloadBtn.addEventListener('click', async () => {
  await loadEntries()
})

async function init() {
  document.title = 'Shotting Book'

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    authStatus.textContent = `Eingeloggt als ${session.user.email}`
    showLoggedInUI()
    await loadEntries()
  } else {
    showLoggedOutUI()
  }

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      authStatus.textContent = `Eingeloggt als ${session.user.email}`
      showLoggedInUI()
      await loadEntries()
    } else {
      showLoggedOutUI()
    }
  })
}

init()
