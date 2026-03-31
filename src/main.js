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

        <select id="entry-type">
          <option value="training">Training</option>
          <option value="competition">Bewerb</option>
        </select>

        <select id="entry-discipline">
          <option value="">Disziplin auswählen</option>
        </select>

        <select id="entry-weapon">
          <option value="">Waffe auswählen</option>
        </select>

        <input id="entry-location" type="text" placeholder="Ort" />
        <input id="entry-note" type="text" placeholder="Notiz" />
      </div>

      <div class="manage-box">
        <h3>Serien</h3>
        <div class="row">
          <label for="series-count">Anzahl Serien</label>
          <input id="series-count" type="number" min="1" max="20" value="5" />
          <button id="apply-series-count-btn" type="button">Serienfelder aktualisieren</button>
        </div>
        <div id="series-inputs"></div>
      </div>

      <div class="manage-box">
        <h3>Neue Disziplin anlegen</h3>
        <div class="row">
          <input id="new-discipline-name" type="text" placeholder="Name der Disziplin" />
          <button id="add-discipline-btn">Disziplin hinzufügen</button>
        </div>
        <p id="discipline-status"></p>
      </div>

      <div class="manage-box">
        <h3>Neue Waffe anlegen</h3>
        <div class="form-grid">
          <input id="new-weapon-name" type="text" placeholder="Name der Waffe" />
          <input id="new-weapon-type" type="text" placeholder="Typ" />
          <input id="new-weapon-caliber" type="text" placeholder="Kaliber" />
          <input id="new-weapon-notes" type="text" placeholder="Notizen zur Waffe" />
        </div>
        <div class="row">
          <button id="add-weapon-btn">Waffe hinzufügen</button>
        </div>
        <p id="weapon-status"></p>
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
const entryDiscipline = document.getElementById('entry-discipline')
const entryWeapon = document.getElementById('entry-weapon')
const entryLocation = document.getElementById('entry-location')
const entryNote = document.getElementById('entry-note')
const saveEntryBtn = document.getElementById('save-entry-btn')
const entryStatus = document.getElementById('entry-status')
const reloadBtn = document.getElementById('reload-btn')
const entriesList = document.getElementById('entries-list')

const seriesCountInput = document.getElementById('series-count')
const applySeriesCountBtn = document.getElementById('apply-series-count-btn')
const seriesInputs = document.getElementById('series-inputs')

const newDisciplineName = document.getElementById('new-discipline-name')
const addDisciplineBtn = document.getElementById('add-discipline-btn')
const disciplineStatus = document.getElementById('discipline-status')

const newWeaponName = document.getElementById('new-weapon-name')
const newWeaponType = document.getElementById('new-weapon-type')
const newWeaponCaliber = document.getElementById('new-weapon-caliber')
const newWeaponNotes = document.getElementById('new-weapon-notes')
const addWeaponBtn = document.getElementById('add-weapon-btn')
const weaponStatus = document.getElementById('weapon-status')

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

function formatEntryType(type) {
  if (type === 'training') return 'Training'
  if (type === 'competition') return 'Bewerb'
  return type || '-'
}

function todayString() {
  return new Date().toISOString().split('T')[0]
}

function getLastWeaponKey(userId) {
  return `shooting_book_last_weapon_${userId}`
}

function getLastDisciplineKey(userId) {
  return `shooting_book_last_discipline_${userId}`
}

async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

function renderSeriesInputs() {
  let count = parseInt(seriesCountInput.value, 10)

  if (!Number.isInteger(count) || count < 1) count = 1
  if (count > 20) count = 20

  seriesCountInput.value = count

  seriesInputs.innerHTML = ''

  for (let i = 1; i <= count; i += 1) {
    const row = document.createElement('div')
    row.className = 'series-row'
    row.innerHTML = `
      <label for="series-score-${i}">Serie ${i}</label>
      <input
        id="series-score-${i}"
        class="series-score-input"
        type="number"
        min="0"
        step="1"
        placeholder="Score"
        data-series-number="${i}"
      />
    `
    seriesInputs.appendChild(row)
  }
}

function getSeriesData() {
  const inputs = Array.from(document.querySelectorAll('.series-score-input'))

  return inputs
    .map((input) => {
      const value = input.value.trim()

      if (value === '') return null

      const score = Number(value)
      const seriesNumber = Number(input.dataset.seriesNumber)

      if (!Number.isFinite(score)) return null

      return {
        series_number: seriesNumber,
        score,
      }
    })
    .filter(Boolean)
}

function calculateTotalScore(seriesData) {
  return seriesData.reduce((sum, item) => sum + item.score, 0)
}

async function loadDisciplines() {
  const user = await getCurrentUser()
  if (!user) return

  const { data, error } = await supabase
    .from('disciplines')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) {
    disciplineStatus.textContent = `Fehler beim Laden der Disziplinen: ${error.message}`
    return
  }

  const lastDisciplineId = localStorage.getItem(getLastDisciplineKey(user.id)) || ''

  entryDiscipline.innerHTML = '<option value="">Disziplin auswählen</option>'

  ;(data || []).forEach((discipline) => {
    const option = document.createElement('option')
    option.value = discipline.id
    option.textContent = discipline.name
    if (discipline.id === lastDisciplineId) {
      option.selected = true
    }
    entryDiscipline.appendChild(option)
  })
}

async function loadWeapons() {
  const user = await getCurrentUser()
  if (!user) return

  const { data, error } = await supabase
    .from('weapons')
    .select('id, name, type, caliber')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) {
    weaponStatus.textContent = `Fehler beim Laden der Waffen: ${error.message}`
    return
  }

  const lastWeaponId = localStorage.getItem(getLastWeaponKey(user.id)) || ''

  entryWeapon.innerHTML = '<option value="">Waffe auswählen</option>'

  ;(data || []).forEach((weapon) => {
    const option = document.createElement('option')
    option.value = weapon.id

    const details = [weapon.type, weapon.caliber].filter(Boolean).join(' | ')
    option.textContent = details ? `${weapon.name} (${details})` : weapon.name

    if (weapon.id === lastWeaponId) {
      option.selected = true
    }

    entryWeapon.appendChild(option)
  })
}

async function loadEntries() {
  entriesList.innerHTML = '<p>Lade Einträge...</p>'

  const user = await getCurrentUser()

  if (!user) {
    entriesList.innerHTML = '<p>Kein Benutzer eingeloggt.</p>'
    return
  }

  const { data, error } = await supabase
    .from('entries')
    .select(`
      id,
      entry_date,
      entry_type,
      location,
      note,
      total_score,
      discipline_id,
      weapon_id,
      disciplines(name),
      weapons(name, type, caliber),
      entry_series(series_number, score)
    `)
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
    .map((entry) => {
      const disciplineName = entry.disciplines?.name || '-'

      let weaponText = '-'
      if (entry.weapons?.name) {
        const details = [entry.weapons.type, entry.weapons.caliber].filter(Boolean).join(' | ')
        weaponText = details ? `${entry.weapons.name} (${details})` : entry.weapons.name
      }

      const seriesList = Array.isArray(entry.entry_series)
        ? [...entry.entry_series]
            .sort((a, b) => a.series_number - b.series_number)
            .map((series) => `Serie ${series.series_number}: ${series.score}`)
            .join(' | ')
        : ''

      return `
        <div class="entry-card">
          <div><strong>Datum:</strong> ${formatDate(entry.entry_date)}</div>
          <div><strong>Typ:</strong> ${formatEntryType(entry.entry_type)}</div>
          <div><strong>Disziplin:</strong> ${disciplineName}</div>
          <div><strong>Waffe:</strong> ${weaponText}</div>
          <div><strong>Ort:</strong> ${entry.location || '-'}</div>
          <div><strong>Notiz:</strong> ${entry.note || '-'}</div>
          <div><strong>Gesamt:</strong> ${entry.total_score ?? '-'}</div>
          <div><strong>Serien:</strong> ${seriesList || '-'}</div>
        </div>
      `
    })
    .join('')
}

async function loadFormData() {
  disciplineStatus.textContent = ''
  weaponStatus.textContent = ''
  await loadDisciplines()
  await loadWeapons()
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
  entryDate.value = todayString()
  renderSeriesInputs()
  await loadFormData()
  await loadEntries()
})

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut()
  authStatus.textContent = 'Ausgeloggt.'
  showLoggedOutUI()
})

entryWeapon.addEventListener('change', async () => {
  const user = await getCurrentUser()
  if (!user) return
  localStorage.setItem(getLastWeaponKey(user.id), entryWeapon.value)
})

entryDiscipline.addEventListener('change', async () => {
  const user = await getCurrentUser()
  if (!user) return
  localStorage.setItem(getLastDisciplineKey(user.id), entryDiscipline.value)
})

applySeriesCountBtn.addEventListener('click', () => {
  renderSeriesInputs()
})

addDisciplineBtn.addEventListener('click', async () => {
  disciplineStatus.textContent = 'Disziplin wird angelegt...'

  const user = await getCurrentUser()
  if (!user) {
    disciplineStatus.textContent = 'Nicht eingeloggt.'
    return
  }

  const name = newDisciplineName.value.trim()

  if (!name) {
    disciplineStatus.textContent = 'Bitte einen Disziplin-Namen eingeben.'
    return
  }

  const { data, error } = await supabase
    .from('disciplines')
    .insert([
      {
        user_id: user.id,
        name,
      },
    ])
    .select('id, name')
    .single()

  if (error) {
    disciplineStatus.textContent = `Fehler: ${error.message}`
    return
  }

  disciplineStatus.textContent = 'Disziplin gespeichert.'
  newDisciplineName.value = ''

  await loadDisciplines()

  if (data?.id) {
    entryDiscipline.value = data.id
    localStorage.setItem(getLastDisciplineKey(user.id), data.id)
  }
})

addWeaponBtn.addEventListener('click', async () => {
  weaponStatus.textContent = 'Waffe wird angelegt...'

  const user = await getCurrentUser()
  if (!user) {
    weaponStatus.textContent = 'Nicht eingeloggt.'
    return
  }

  const name = newWeaponName.value.trim()

  if (!name) {
    weaponStatus.textContent = 'Bitte einen Waffen-Namen eingeben.'
    return
  }

  const { data, error } = await supabase
    .from('weapons')
    .insert([
      {
        user_id: user.id,
        name,
        type: newWeaponType.value.trim() || null,
        caliber: newWeaponCaliber.value.trim() || null,
        notes: newWeaponNotes.value.trim() || null,
      },
    ])
    .select('id, name')
    .single()

  if (error) {
    weaponStatus.textContent = `Fehler: ${error.message}`
    return
  }

  weaponStatus.textContent = 'Waffe gespeichert.'
  newWeaponName.value = ''
  newWeaponType.value = ''
  newWeaponCaliber.value = ''
  newWeaponNotes.value = ''

  await loadWeapons()

  if (data?.id) {
    entryWeapon.value = data.id
    localStorage.setItem(getLastWeaponKey(user.id), data.id)
  }
})

saveEntryBtn.addEventListener('click', async () => {
  entryStatus.textContent = 'Speichere Eintrag...'

  const user = await getCurrentUser()

  if (!user) {
    entryStatus.textContent = 'Nicht eingeloggt.'
    return
  }

  if (!entryDate.value) {
    entryStatus.textContent = 'Bitte ein Datum wählen.'
    return
  }

  const seriesData = getSeriesData()
  const totalScore = calculateTotalScore(seriesData)

  const { data: entryData, error: entryError } = await supabase
    .from('entries')
    .insert([
      {
        user_id: user.id,
        entry_date: entryDate.value,
        entry_type: entryType.value || null,
        discipline_id: entryDiscipline.value || null,
        weapon_id: entryWeapon.value || null,
        location: entryLocation.value.trim() || null,
        note: entryNote.value.trim() || null,
        total_score: totalScore,
      },
    ])
    .select('id')
    .single()

  if (entryError) {
    entryStatus.textContent = `Fehler: ${entryError.message}`
    return
  }

  if (seriesData.length > 0) {
    const seriesRows = seriesData.map((series) => ({
      entry_id: entryData.id,
      user_id: user.id,
      series_number: series.series_number,
      score: series.score,
    }))

    const { error: seriesError } = await supabase
      .from('entry_series')
      .insert(seriesRows)

    if (seriesError) {
      entryStatus.textContent = `Fehler bei Serien: ${seriesError.message}`
      return
    }
  }

  localStorage.setItem(getLastWeaponKey(user.id), entryWeapon.value || '')
  localStorage.setItem(getLastDisciplineKey(user.id), entryDiscipline.value || '')

  entryStatus.textContent = 'Eintrag gespeichert.'

  entryDate.value = todayString()
  entryType.value = 'training'
  entryLocation.value = ''
  entryNote.value = ''
  seriesCountInput.value = '5'
  renderSeriesInputs()

  await loadFormData()
  await loadEntries()
})

reloadBtn.addEventListener('click', async () => {
  await loadFormData()
  await loadEntries()
})

async function init() {
  document.title = 'Shooting Book'
  entryDate.value = todayString()
  renderSeriesInputs()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    authStatus.textContent = `Eingeloggt als ${session.user.email}`
    showLoggedInUI()
    await loadFormData()
    await loadEntries()
  } else {
    showLoggedOutUI()
  }

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      authStatus.textContent = `Eingeloggt als ${session.user.email}`
      showLoggedInUI()
      entryDate.value = todayString()
      renderSeriesInputs()
      await loadFormData()
      await loadEntries()
    } else {
      showLoggedOutUI()
    }
  })
}

init()
