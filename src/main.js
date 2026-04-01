import './style.css'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uvgqbnsexnwrqkxrsxib.supabase.co'
const supabaseKey = 'sb_publishable_X0J-88ZYBNSy4HWNHyF56Q_xWCD40ex'
const supabase = createClient(supabaseUrl, supabaseKey)

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <section id="splash-screen" class="splash-screen">
      <div class="splash-inner">
        <button id="start-app-btn" class="start-app-btn">Start</button>
      </div>
    </section>

    <div id="main-stage" style="display:none;">
      <header class="topbar">
        <div class="topbar-left"></div>
        <div class="topbar-right" id="topbar-user-area" style="display:none;">
          <span id="user-badge" class="user-badge"></span>
          <button id="logout-btn" class="topbar-logout-btn" style="display:none;">Logout</button>
        </div>
      </header>

      <main class="container">
        <div id="auth-box">
          <h2>Login / Registrierung</h2>
          <input id="email" type="email" placeholder="E-Mail" />
          <input id="password" type="password" placeholder="Passwort" />
          <div class="row auth-actions">
            <button id="register-btn">Registrieren</button>
            <button id="login-btn">Login</button>
          </div>
          <p id="auth-status"></p>
        </div>

        <hr id="auth-divider" />

        <div id="main-app" style="display:none;">
          <div class="tabs-bar main-tabs">
            <button id="tab-entry-btn" class="tab-btn active" type="button">Neuer Eintrag</button>
            <button id="tab-stats-btn" class="tab-btn" type="button">Statistik</button>
            <button id="tab-list-btn" class="tab-btn" type="button">Meine Einträge</button>
          </div>

          <section id="entry-tab" class="tab-panel active">
            <div id="entry-box">
              <h2 id="form-title">Neuer Eintrag</h2>

              <div class="form-grid mobile-single-grid">
                <input id="entry-date" class="uniform-input" type="date" />

                <select id="entry-type" class="uniform-input">
                  <option value="training">Training</option>
                  <option value="competition">Bewerb</option>
                </select>

                <select id="entry-discipline" class="uniform-input">
                  <option value="">Disziplin auswählen</option>
                </select>

                <select id="entry-weapon" class="uniform-input">
                  <option value="">Waffe auswählen</option>
                </select>

                <input id="entry-location" class="uniform-input" type="text" placeholder="Ort" />
                <input id="entry-note" class="uniform-input" type="text" placeholder="Notiz" />

                <input id="shots-per-series" class="uniform-input" type="number" min="1" max="50" placeholder="Schuss pro Serie eingeben" />
              </div>

              <div class="manage-box">
                <h3>Serien</h3>
                <div class="row series-actions vertical-mobile-row">
                  <label for="series-count">Anzahl Serien</label>
                  <input id="series-count" class="uniform-input" type="number" min="1" max="20" value="5" />
                  <button id="apply-series-count-btn" type="button">Serienfelder aktualisieren</button>
                </div>
                <div id="series-inputs"></div>
              </div>

              <div class="collapsible-box">
                <button id="toggle-discipline-panel-btn" type="button" class="section-toggle-btn">
                  + Neue Disziplin anlegen
                </button>
                <div id="discipline-panel" class="collapsible-panel" style="display:none;">
                  <div class="manage-box inner-manage-box">
                    <h3>Neue Disziplin anlegen</h3>
                    <div class="form-grid mobile-single-grid">
                      <input id="new-discipline-name" class="uniform-input" type="text" placeholder="Name der Disziplin" />
                      <button id="add-discipline-btn">Disziplin hinzufügen</button>
                    </div>
                    <p id="discipline-status"></p>
                  </div>
                </div>
              </div>

              <div class="collapsible-box">
                <button id="toggle-weapon-panel-btn" type="button" class="section-toggle-btn">
                  + Neue Waffe anlegen
                </button>
                <div id="weapon-panel" class="collapsible-panel" style="display:none;">
                  <div class="manage-box inner-manage-box">
                    <h3>Neue Waffe anlegen</h3>
                    <div class="form-grid mobile-single-grid">
                      <input id="new-weapon-name" class="uniform-input" type="text" placeholder="Name der Waffe" />
                      <input id="new-weapon-type" class="uniform-input" type="text" placeholder="Typ" />
                      <input id="new-weapon-caliber" class="uniform-input" type="text" placeholder="Kaliber" />
                      <input id="new-weapon-notes" class="uniform-input" type="text" placeholder="Notizen zur Waffe" />
                    </div>
                    <div class="row vertical-mobile-row">
                      <button id="add-weapon-btn">Waffe hinzufügen</button>
                    </div>
                    <p id="weapon-status"></p>
                  </div>
                </div>
              </div>

              <div class="row entry-actions vertical-mobile-row">
                <button id="save-entry-btn">Eintrag speichern</button>
                <button id="cancel-edit-btn" type="button" style="display:none;">Bearbeiten abbrechen</button>
              </div>
              <p id="entry-status"></p>
            </div>
          </section>

          <section id="stats-tab" class="tab-panel">
            <div id="stats-box">
              <h2>Statistik</h2>

              <div class="tabs-bar sub-tabs">
                <button id="stats-sub-summary-btn" class="tab-btn active" type="button">Überblick</button>
                <button id="stats-sub-charts-btn" class="tab-btn" type="button">Grafiken</button>
                <button id="stats-sub-details-btn" class="tab-btn" type="button">Auswertung</button>
              </div>

              <section id="stats-sub-summary" class="tab-panel active">
                <div id="stats-summary" class="stats-grid"></div>
              </section>

              <section id="stats-sub-charts" class="tab-panel">
                <div class="stats-charts-grid">
                  <div class="manage-box">
                    <h3>Training vs. Bewerb</h3>
                    <div id="chart-type-breakdown"></div>
                  </div>

                  <div class="manage-box">
                    <h3>Einträge pro Monat</h3>
                    <div id="chart-monthly-entries"></div>
                  </div>
                </div>

                <div class="manage-box">
                  <h3>Score-Entwicklung</h3>
                  <div id="chart-score-trend"></div>
                </div>
              </section>

              <section id="stats-sub-details" class="tab-panel">
                <div class="manage-box">
                  <h3>Nach Typ</h3>
                  <div id="stats-by-type"></div>
                </div>

                <div class="manage-box">
                  <h3>Nach Disziplin</h3>
                  <div id="stats-by-discipline"></div>
                </div>

                <div class="manage-box">
                  <h3>Nach Waffe</h3>
                  <div id="stats-by-weapon"></div>
                </div>
              </section>
            </div>
          </section>

          <section id="list-tab" class="tab-panel">
            <div id="list-box">
              <h2>Meine Einträge</h2>

              <div class="manage-box filter-box">
                <h3>Filter</h3>
                <div class="form-grid mobile-single-grid">
                  <select id="filter-type" class="uniform-input">
                    <option value="">Alle Typen</option>
                    <option value="training">Training</option>
                    <option value="competition">Bewerb</option>
                  </select>

                  <select id="filter-year" class="uniform-input">
                    <option value="">Alle Jahre</option>
                  </select>

                  <select id="filter-month" class="uniform-input">
                    <option value="">Alle Monate</option>
                    <option value="1">Januar</option>
                    <option value="2">Februar</option>
                    <option value="3">März</option>
                    <option value="4">April</option>
                    <option value="5">Mai</option>
                    <option value="6">Juni</option>
                    <option value="7">Juli</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Dezember</option>
                  </select>

                  <select id="filter-discipline" class="uniform-input">
                    <option value="">Alle Disziplinen</option>
                  </select>

                  <select id="filter-weapon" class="uniform-input">
                    <option value="">Alle Waffen</option>
                  </select>
                </div>

                <div class="row filter-actions vertical-mobile-row">
                  <button id="apply-filters-btn" type="button">Filter anwenden</button>
                  <button id="reset-filters-btn" type="button">Filter zurücksetzen</button>
                  <button id="reload-btn" type="button">Liste aktualisieren</button>
                </div>

                <div id="list-summary" class="list-summary"></div>
              </div>

              <div id="entries-list"></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
`

const splashScreen = document.getElementById('splash-screen')
const startAppBtn = document.getElementById('start-app-btn')
const mainStage = document.getElementById('main-stage')

const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const registerBtn = document.getElementById('register-btn')
const loginBtn = document.getElementById('login-btn')
const logoutBtn = document.getElementById('logout-btn')
const authStatus = document.getElementById('auth-status')
const authBox = document.getElementById('auth-box')
const authDivider = document.getElementById('auth-divider')
const mainApp = document.getElementById('main-app')
const topbarUserArea = document.getElementById('topbar-user-area')
const userBadge = document.getElementById('user-badge')

const tabEntryBtn = document.getElementById('tab-entry-btn')
const tabStatsBtn = document.getElementById('tab-stats-btn')
const tabListBtn = document.getElementById('tab-list-btn')
const entryTab = document.getElementById('entry-tab')
const statsTab = document.getElementById('stats-tab')
const listTab = document.getElementById('list-tab')

const statsSubSummaryBtn = document.getElementById('stats-sub-summary-btn')
const statsSubChartsBtn = document.getElementById('stats-sub-charts-btn')
const statsSubDetailsBtn = document.getElementById('stats-sub-details-btn')
const statsSubSummary = document.getElementById('stats-sub-summary')
const statsSubCharts = document.getElementById('stats-sub-charts')
const statsSubDetails = document.getElementById('stats-sub-details')

const formTitle = document.getElementById('form-title')
const entryDate = document.getElementById('entry-date')
const entryType = document.getElementById('entry-type')
const entryDiscipline = document.getElementById('entry-discipline')
const entryWeapon = document.getElementById('entry-weapon')
const entryLocation = document.getElementById('entry-location')
const entryNote = document.getElementById('entry-note')
const shotsPerSeriesInput = document.getElementById('shots-per-series')
const saveEntryBtn = document.getElementById('save-entry-btn')
const cancelEditBtn = document.getElementById('cancel-edit-btn')
const entryStatus = document.getElementById('entry-status')
const entriesList = document.getElementById('entries-list')

const statsSummary = document.getElementById('stats-summary')
const statsByType = document.getElementById('stats-by-type')
const statsByDiscipline = document.getElementById('stats-by-discipline')
const statsByWeapon = document.getElementById('stats-by-weapon')
const chartTypeBreakdown = document.getElementById('chart-type-breakdown')
const chartMonthlyEntries = document.getElementById('chart-monthly-entries')
const chartScoreTrend = document.getElementById('chart-score-trend')

const filterType = document.getElementById('filter-type')
const filterYear = document.getElementById('filter-year')
const filterMonth = document.getElementById('filter-month')
const filterDiscipline = document.getElementById('filter-discipline')
const filterWeapon = document.getElementById('filter-weapon')
const applyFiltersBtn = document.getElementById('apply-filters-btn')
const resetFiltersBtn = document.getElementById('reset-filters-btn')
const reloadBtn = document.getElementById('reload-btn')
const listSummary = document.getElementById('list-summary')

const seriesCountInput = document.getElementById('series-count')
const applySeriesCountBtn = document.getElementById('apply-series-count-btn')
const seriesInputs = document.getElementById('series-inputs')

const toggleDisciplinePanelBtn = document.getElementById('toggle-discipline-panel-btn')
const disciplinePanel = document.getElementById('discipline-panel')
const newDisciplineName = document.getElementById('new-discipline-name')
const addDisciplineBtn = document.getElementById('add-discipline-btn')
const disciplineStatus = document.getElementById('discipline-status')

const toggleWeaponPanelBtn = document.getElementById('toggle-weapon-panel-btn')
const weaponPanel = document.getElementById('weapon-panel')
const newWeaponName = document.getElementById('new-weapon-name')
const newWeaponType = document.getElementById('new-weapon-type')
const newWeaponCaliber = document.getElementById('new-weapon-caliber')
const newWeaponNotes = document.getElementById('new-weapon-notes')
const addWeaponBtn = document.getElementById('add-weapon-btn')
const weaponStatus = document.getElementById('weapon-status')

let editingEntryId = null
let allEntriesCache = []

function activateTab(tabName) {
  ;[
    [tabEntryBtn, entryTab, 'entry'],
    [tabStatsBtn, statsTab, 'stats'],
    [tabListBtn, listTab, 'list'],
  ].forEach(([btn, panel, name]) => {
    const active = tabName === name
    btn.classList.toggle('active', active)
    panel.classList.toggle('active', active)
  })
}

function activateStatsSubTab(tabName) {
  ;[
    [statsSubSummaryBtn, statsSubSummary, 'summary'],
    [statsSubChartsBtn, statsSubCharts, 'charts'],
    [statsSubDetailsBtn, statsSubDetails, 'details'],
  ].forEach(([btn, panel, name]) => {
    const active = tabName === name
    btn.classList.toggle('active', active)
    panel.classList.toggle('active', active)
  })
}

function showSplash() {
  splashScreen.style.display = 'flex'
  mainStage.style.display = 'none'
  document.body.classList.remove('app-mode')
}

function showStage() {
  splashScreen.style.display = 'none'
  mainStage.style.display = 'block'
}

function showLoggedInUI(session) {
  document.body.classList.add('app-mode')
  authBox.style.display = 'none'
  authDivider.style.display = 'none'
  mainApp.style.display = 'block'

  topbarUserArea.style.display = 'flex'
  logoutBtn.style.display = 'inline-flex'
  loginBtn.style.display = 'none'
  registerBtn.style.display = 'none'

  userBadge.textContent = session?.user?.email || ''
}

function showLoggedOutUI() {
  document.body.classList.remove('app-mode')
  authBox.style.display = 'block'
  authDivider.style.display = 'block'
  mainApp.style.display = 'none'

  topbarUserArea.style.display = 'none'
  logoutBtn.style.display = 'none'
  loginBtn.style.display = 'inline-flex'
  registerBtn.style.display = 'inline-flex'

  allEntriesCache = []
  entriesList.innerHTML = ''
  listSummary.innerHTML = ''
  statsSummary.innerHTML = ''
  statsByType.innerHTML = ''
  statsByDiscipline.innerHTML = ''
  statsByWeapon.innerHTML = ''
  chartTypeBreakdown.innerHTML = ''
  chartMonthlyEntries.innerHTML = ''
  chartScoreTrend.innerHTML = ''
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

function formatNumber(value) {
  return Number(value || 0).toLocaleString('de-AT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function setCollapsibleState(button, panel, isOpen, openText, closedText) {
  panel.style.display = isOpen ? 'block' : 'none'
  button.textContent = isOpen ? openText : closedText
}

function openDisciplinePanel() {
  setCollapsibleState(toggleDisciplinePanelBtn, disciplinePanel, true, '− Disziplin schließen', '+ Neue Disziplin anlegen')
}

function closeDisciplinePanel() {
  setCollapsibleState(toggleDisciplinePanelBtn, disciplinePanel, false, '− Disziplin schließen', '+ Neue Disziplin anlegen')
}

function openWeaponPanel() {
  setCollapsibleState(toggleWeaponPanelBtn, weaponPanel, true, '− Waffe schließen', '+ Neue Waffe anlegen')
}

function closeWeaponPanel() {
  setCollapsibleState(toggleWeaponPanelBtn, weaponPanel, false, '− Waffe schließen', '+ Neue Waffe anlegen')
}

function renderStatsTable(container, rows, emptyText) {
  if (!rows.length) {
    container.innerHTML = `<p>${emptyText}</p>`
    return
  }

  container.innerHTML = `
    <div class="stats-table">
      <div class="stats-table-head">
        <div>Name</div>
        <div>Einträge</div>
        <div>Serien</div>
        <div>Gesamt</div>
        <div>Schnitt/Eintrag</div>
      </div>
      ${rows.map((row) => `
        <div class="stats-table-row">
          <div>${row.name}</div>
          <div>${row.entries}</div>
          <div>${row.series}</div>
          <div>${formatNumber(row.total)}</div>
          <div>${formatNumber(row.averagePerEntry)}</div>
        </div>
      `).join('')}
    </div>
  `
}

function buildGroupedStats(entries, getGroupName) {
  const groups = new Map()

  entries.forEach((entry) => {
    const name = getGroupName(entry) || '-'
    if (!groups.has(name)) groups.set(name, { name, entries: 0, series: 0, total: 0 })

    const group = groups.get(name)
    group.entries += 1
    group.series += Array.isArray(entry.entry_series) ? entry.entry_series.length : 0
    group.total += Number(entry.total_score || 0)
  })

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      averagePerEntry: group.entries > 0 ? group.total / group.entries : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

function renderBarChart(container, items, emptyText) {
  if (!items.length) {
    container.innerHTML = `<p>${emptyText}</p>`
    return
  }

  const maxValue = Math.max(...items.map((item) => item.value), 1)

  container.innerHTML = `
    <div class="mini-bar-chart">
      ${items.map((item) => {
        const width = (item.value / maxValue) * 100
        return `
          <div class="mini-bar-row">
            <div class="mini-bar-label">${item.label}</div>
            <div class="mini-bar-track">
              <div class="mini-bar-fill" style="width:${width}%;"></div>
            </div>
            <div class="mini-bar-value">${item.value}</div>
          </div>
        `
      }).join('')}
    </div>
  `
}

function renderLineChart(container, points, emptyText) {
  if (!points.length) {
    container.innerHTML = `<p>${emptyText}</p>`
    return
  }

  if (points.length === 1) {
    container.innerHTML = `
      <div class="single-point-chart">
        <div class="single-point-value">${formatNumber(points[0].value)}</div>
        <div class="single-point-label">${points[0].label}</div>
      </div>
    `
    return
  }

  const width = 760
  const height = 260
  const padding = 36
  const maxValue = Math.max(...points.map((p) => p.value), 1)
  const minValue = Math.min(...points.map((p) => p.value), 0)
  const valueRange = maxValue - minValue || 1
  const stepX = (width - padding * 2) / (points.length - 1)

  const coordinates = points.map((point, index) => {
    const x = padding + index * stepX
    const normalized = (point.value - minValue) / valueRange
    const y = height - padding - normalized * (height - padding * 2)
    return { ...point, x, y }
  })

  const polylinePoints = coordinates.map((point) => `${point.x},${point.y}`).join(' ')

  container.innerHTML = `
    <div class="svg-chart-wrapper">
      <svg viewBox="0 0 ${width} ${height}" class="svg-chart" preserveAspectRatio="none" aria-label="Diagramm">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" class="chart-axis"></line>
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" class="chart-axis"></line>
        <polyline fill="none" points="${polylinePoints}" class="chart-line"></polyline>
        ${coordinates.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="4.5" class="chart-point"></circle>`).join('')}
      </svg>
      <div class="chart-label-row">
        ${points.map((point) => `
          <div class="chart-label-item">
            <span class="chart-label-text">${point.label}</span>
            <span class="chart-label-value">${formatNumber(point.value)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function renderCharts(entries) {
  if (!entries.length) {
    chartTypeBreakdown.innerHTML = '<p>Noch keine Daten vorhanden.</p>'
    chartMonthlyEntries.innerHTML = '<p>Noch keine Daten vorhanden.</p>'
    chartScoreTrend.innerHTML = '<p>Noch keine Daten vorhanden.</p>'
    return
  }

  const trainingCount = entries.filter((entry) => entry.entry_type === 'training').length
  const competitionCount = entries.filter((entry) => entry.entry_type === 'competition').length

  renderBarChart(
    chartTypeBreakdown,
    [
      { label: 'Training', value: trainingCount },
      { label: 'Bewerb', value: competitionCount },
    ],
    'Noch keine Typ-Daten vorhanden.'
  )

  const monthlyMap = new Map()
  entries.forEach((entry) => {
    if (!entry.entry_date) return
    const date = new Date(entry.entry_date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1)
  })

  renderBarChart(
    chartMonthlyEntries,
    Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, value]) => ({ label, value })),
    'Noch keine Monatsdaten vorhanden.'
  )

  const sortedByDate = [...entries]
    .filter((entry) => entry.entry_date)
    .sort((a, b) => new Date(a.entry_date) - new Date(b.entry_date))
    .map((entry) => ({
      label: formatDate(entry.entry_date),
      value: Number(entry.total_score || 0),
    }))

  renderLineChart(chartScoreTrend, sortedByDate, 'Noch keine Score-Daten vorhanden.')
}

function renderStatistics(entries) {
  if (!entries.length) {
    statsSummary.innerHTML = '<p>Noch keine Daten vorhanden.</p>'
    statsByType.innerHTML = '<p>Noch keine Daten vorhanden.</p>'
    statsByDiscipline.innerHTML = '<p>Noch keine Daten vorhanden.</p>'
    statsByWeapon.innerHTML = '<p>Noch keine Daten vorhanden.</p>'
    renderCharts([])
    return
  }

  const entryCount = entries.length
  const seriesCount = entries.reduce((sum, entry) => sum + (Array.isArray(entry.entry_series) ? entry.entry_series.length : 0), 0)
  const totalScore = entries.reduce((sum, entry) => sum + Number(entry.total_score || 0), 0)
  const averagePerEntry = entryCount > 0 ? totalScore / entryCount : 0
  const averagePerSeries = seriesCount > 0 ? totalScore / seriesCount : 0
  const bestEntry = [...entries].sort((a, b) => Number(b.total_score || 0) - Number(a.total_score || 0))[0]
  const bestEntryText = bestEntry ? `${formatNumber(bestEntry.total_score || 0)} am ${formatDate(bestEntry.entry_date)}` : '-'

  statsSummary.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Einträge</div>
      <div class="stat-value">${entryCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Serien</div>
      <div class="stat-value">${seriesCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Gesamtscore</div>
      <div class="stat-value">${formatNumber(totalScore)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Schnitt / Eintrag</div>
      <div class="stat-value">${formatNumber(averagePerEntry)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Schnitt / Serie</div>
      <div class="stat-value">${formatNumber(averagePerSeries)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Bester Eintrag</div>
      <div class="stat-value small">${bestEntryText}</div>
    </div>
  `

  renderCharts(entries)
  renderStatsTable(statsByType, buildGroupedStats(entries, (entry) => formatEntryType(entry.entry_type)), 'Noch keine Typ-Daten vorhanden.')
  renderStatsTable(statsByDiscipline, buildGroupedStats(entries, (entry) => entry.disciplines?.name || '-'), 'Noch keine Disziplin-Daten vorhanden.')
  renderStatsTable(
    statsByWeapon,
    buildGroupedStats(entries, (entry) => {
      if (!entry.weapons?.name) return '-'
      const details = [entry.weapons.type, entry.weapons.caliber].filter(Boolean).join(' | ')
      return details ? `${entry.weapons.name} (${details})` : entry.weapons.name
    }),
    'Noch keine Waffen-Daten vorhanden.'
  )
}

async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

function renderSeriesInputs(scores = []) {
  let count = parseInt(seriesCountInput.value, 10)
  if (!Number.isInteger(count) || count < 1) count = 1
  if (count > 20) count = 20

  seriesCountInput.value = count
  seriesInputs.innerHTML = ''

  for (let i = 1; i <= count; i += 1) {
    const value = scores[i - 1] ?? ''
    const row = document.createElement('div')
    row.className = 'series-row'
    row.innerHTML = `
      <label for="series-score-${i}">Serie ${i}</label>
      <input
        id="series-score-${i}"
        class="uniform-input series-score-input"
        type="number"
        min="0"
        step="1"
        placeholder="Score"
        data-series-number="${i}"
        value="${value}"
      />
    `
    seriesInputs.appendChild(row)
  }
}

function getSeriesData() {
  return Array.from(document.querySelectorAll('.series-score-input'))
    .map((input) => {
      const value = input.value.trim()
      if (value === '') return null

      const score = Number(value)
      const seriesNumber = Number(input.dataset.seriesNumber)
      if (!Number.isFinite(score)) return null

      return { series_number: seriesNumber, score }
    })
    .filter(Boolean)
}

function calculateTotalScore(seriesData) {
  return seriesData.reduce((sum, item) => sum + item.score, 0)
}

function resetForm() {
  editingEntryId = null
  formTitle.textContent = 'Neuer Eintrag'
  saveEntryBtn.textContent = 'Eintrag speichern'
  cancelEditBtn.style.display = 'none'
  entryStatus.textContent = ''

  entryDate.value = todayString()
  entryType.value = 'training'
  entryLocation.value = ''
  entryNote.value = ''
  shotsPerSeriesInput.value = ''
  seriesCountInput.value = '5'
  renderSeriesInputs()
}

function populateFilterOptions(entries) {
  const years = [...new Set(entries.map((entry) => (entry.entry_date ? new Date(entry.entry_date).getFullYear() : null)).filter(Boolean))].sort((a, b) => b - a)

  const disciplines = [...new Map(
    entries.filter((entry) => entry.disciplines?.name).map((entry) => [entry.discipline_id, entry.disciplines.name])
  ).entries()]

  const weapons = [...new Map(
    entries.filter((entry) => entry.weapons?.name).map((entry) => {
      const details = [entry.weapons.type, entry.weapons.caliber].filter(Boolean).join(' | ')
      return [entry.weapon_id, details ? `${entry.weapons.name} (${details})` : entry.weapons.name]
    })
  ).entries()]

  const currentYear = filterYear.value
  const currentDiscipline = filterDiscipline.value
  const currentWeapon = filterWeapon.value

  filterYear.innerHTML = '<option value="">Alle Jahre</option>'
  years.forEach((year) => {
    const option = document.createElement('option')
    option.value = String(year)
    option.textContent = String(year)
    if (String(year) === currentYear) option.selected = true
    filterYear.appendChild(option)
  })

  filterDiscipline.innerHTML = '<option value="">Alle Disziplinen</option>'
  disciplines.forEach(([id, name]) => {
    const option = document.createElement('option')
    option.value = id
    option.textContent = name
    if (id === currentDiscipline) option.selected = true
    filterDiscipline.appendChild(option)
  })

  filterWeapon.innerHTML = '<option value="">Alle Waffen</option>'
  weapons.forEach(([id, name]) => {
    const option = document.createElement('option')
    option.value = id
    option.textContent = name
    if (id === currentWeapon) option.selected = true
    filterWeapon.appendChild(option)
  })
}

function getFilteredEntries() {
  return allEntriesCache.filter((entry) => {
    const entryDateObj = entry.entry_date ? new Date(entry.entry_date) : null
    const entryYear = entryDateObj ? String(entryDateObj.getFullYear()) : ''
    const entryMonth = entryDateObj ? String(entryDateObj.getMonth() + 1) : ''

    if (filterType.value && entry.entry_type !== filterType.value) return false
    if (filterYear.value && entryYear !== filterYear.value) return false
    if (filterMonth.value && entryMonth !== filterMonth.value) return false
    if (filterDiscipline.value && entry.discipline_id !== filterDiscipline.value) return false
    if (filterWeapon.value && entry.weapon_id !== filterWeapon.value) return false
    return true
  })
}

function renderListSummary(entries) {
  const trainingCount = entries.filter((entry) => entry.entry_type === 'training').length
  const competitionCount = entries.filter((entry) => entry.entry_type === 'competition').length
  const dates = entries.map((entry) => entry.entry_date).filter(Boolean).sort()

  let periodText = 'Zeitraum: alle'
  if (dates.length > 0) {
    periodText = `Zeitraum: ${formatDate(dates[0])} bis ${formatDate(dates[dates.length - 1])}`
  }

  listSummary.innerHTML = `
    <div class="summary-chip"><strong>Gefilterte Einträge:</strong> ${entries.length}</div>
    <div class="summary-chip"><strong>Training:</strong> ${trainingCount}</div>
    <div class="summary-chip"><strong>Bewerb:</strong> ${competitionCount}</div>
    <div class="summary-chip"><strong>${periodText}</strong></div>
  `
}

function renderEntriesList(entries) {
  if (!entries.length) {
    entriesList.innerHTML = '<p>Keine Einträge für den aktuellen Filter.</p>'
    renderListSummary(entries)
    return
  }

  renderListSummary(entries)

  entriesList.innerHTML = entries.map((entry) => {
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
        <div><strong>Schuss pro Serie:</strong> ${entry.shots_per_series ?? '-'}</div>
        <div><strong>Ort:</strong> ${entry.location || '-'}</div>
        <div><strong>Notiz:</strong> ${entry.note || '-'}</div>
        <div><strong>Gesamt:</strong> ${entry.total_score ?? '-'}</div>
        <div><strong>Serien:</strong> ${seriesList || '-'}</div>
        <div class="row vertical-mobile-row">
          <button class="edit-entry-btn" data-entry-id="${entry.id}">Bearbeiten</button>
          <button class="delete-entry-btn" data-entry-id="${entry.id}">Löschen</button>
        </div>
      </div>
    `
  }).join('')

  document.querySelectorAll('.delete-entry-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      await deleteEntry(button.dataset.entryId)
    })
  })

  document.querySelectorAll('.edit-entry-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      await startEditEntry(button.dataset.entryId)
    })
  })
}

function applyEntryFilters() {
  renderEntriesList(getFilteredEntries())
}

function resetFilters() {
  filterType.value = ''
  filterYear.value = ''
  filterMonth.value = ''
  filterDiscipline.value = ''
  filterWeapon.value = ''
  applyEntryFilters()
}

async function loadDisciplines() {
  const user = await getCurrentUser()
  if (!user) return

  const { data, error } = await supabase.from('disciplines').select('id, name').eq('user_id', user.id).order('name', { ascending: true })
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
    if (discipline.id === lastDisciplineId && !editingEntryId) option.selected = true
    entryDiscipline.appendChild(option)
  })
}

async function loadWeapons() {
  const user = await getCurrentUser()
  if (!user) return

  const { data, error } = await supabase.from('weapons').select('id, name, type, caliber').eq('user_id', user.id).order('name', { ascending: true })
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
    if (weapon.id === lastWeaponId && !editingEntryId) option.selected = true
    entryWeapon.appendChild(option)
  })
}

async function deleteEntry(entryId) {
  if (!window.confirm('Eintrag wirklich löschen?')) return

  entryStatus.textContent = 'Lösche Eintrag...'
  const user = await getCurrentUser()
  if (!user) {
    entryStatus.textContent = 'Nicht eingeloggt.'
    return
  }

  const { error: seriesError } = await supabase.from('entry_series').delete().eq('entry_id', entryId).eq('user_id', user.id)
  if (seriesError) {
    entryStatus.textContent = `Fehler beim Löschen der Serien: ${seriesError.message}`
    return
  }

  const { error: entryError } = await supabase.from('entries').delete().eq('id', entryId).eq('user_id', user.id)
  if (entryError) {
    entryStatus.textContent = `Fehler beim Löschen des Eintrags: ${entryError.message}`
    return
  }

  if (editingEntryId === entryId) {
    resetForm()
    await loadFormData()
  }

  entryStatus.textContent = 'Eintrag gelöscht.'
  await loadEntries()
}

async function startEditEntry(entryId) {
  entryStatus.textContent = 'Lade Eintrag zur Bearbeitung...'
  const user = await getCurrentUser()
  if (!user) {
    entryStatus.textContent = 'Nicht eingeloggt.'
    return
  }

  const { data, error } = await supabase
    .from('entries')
    .select(`
      id,
      entry_date,
      entry_type,
      discipline_id,
      weapon_id,
      location,
      note,
      shots_per_series,
      entry_series(series_number, score)
    `)
    .eq('id', entryId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    entryStatus.textContent = `Fehler beim Laden des Eintrags: ${error.message}`
    return
  }

  editingEntryId = data.id
  formTitle.textContent = 'Eintrag bearbeiten'
  saveEntryBtn.textContent = 'Änderungen speichern'
  cancelEditBtn.style.display = 'inline-block'

  entryDate.value = data.entry_date || todayString()
  entryType.value = data.entry_type || 'training'
  entryDiscipline.value = data.discipline_id || ''
  entryWeapon.value = data.weapon_id || ''
  entryLocation.value = data.location || ''
  entryNote.value = data.note || ''
  shotsPerSeriesInput.value = data.shots_per_series || ''

  const sortedSeries = Array.isArray(data.entry_series) ? [...data.entry_series].sort((a, b) => a.series_number - b.series_number) : []
  const scores = sortedSeries.map((item) => item.score)
  seriesCountInput.value = String(Math.max(sortedSeries.length || 0, 1))
  renderSeriesInputs(scores)

  activateTab('entry')
  entryStatus.textContent = 'Bearbeitungsmodus aktiv.'
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
      shots_per_series,
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

  allEntriesCache = data || []
  renderStatistics(allEntriesCache)
  populateFilterOptions(allEntriesCache)
  applyEntryFilters()
}

async function loadFormData() {
  disciplineStatus.textContent = ''
  weaponStatus.textContent = ''
  await loadDisciplines()
  await loadWeapons()
}

startAppBtn.addEventListener('click', () => {
  showStage()
  showLoggedOutUI()
})

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
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  })

  if (error) {
    authStatus.textContent = `Fehler: ${error.message}`
    return
  }

  authStatus.textContent = 'Login erfolgreich.'
  showLoggedInUI(data.session)
  resetForm()
  closeDisciplinePanel()
  closeWeaponPanel()
  activateTab('entry')
  activateStatsSubTab('summary')
  await loadFormData()
  await loadEntries()
})

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut()
  authStatus.textContent = 'Ausgeloggt.'
  showLoggedOutUI()
})

tabEntryBtn.addEventListener('click', () => activateTab('entry'))
tabStatsBtn.addEventListener('click', () => activateTab('stats'))
tabListBtn.addEventListener('click', () => activateTab('list'))

statsSubSummaryBtn.addEventListener('click', () => activateStatsSubTab('summary'))
statsSubChartsBtn.addEventListener('click', () => activateStatsSubTab('charts'))
statsSubDetailsBtn.addEventListener('click', () => activateStatsSubTab('details'))

toggleDisciplinePanelBtn.addEventListener('click', () => {
  if (disciplinePanel.style.display === 'block') closeDisciplinePanel()
  else openDisciplinePanel()
})

toggleWeaponPanelBtn.addEventListener('click', () => {
  if (weaponPanel.style.display === 'block') closeWeaponPanel()
  else openWeaponPanel()
})

entryWeapon.addEventListener('change', async () => {
  const user = await getCurrentUser()
  if (user) localStorage.setItem(getLastWeaponKey(user.id), entryWeapon.value)
})

entryDiscipline.addEventListener('change', async () => {
  const user = await getCurrentUser()
  if (user) localStorage.setItem(getLastDisciplineKey(user.id), entryDiscipline.value)
})

applySeriesCountBtn.addEventListener('click', () => renderSeriesInputs())

cancelEditBtn.addEventListener('click', async () => {
  resetForm()
  await loadFormData()
})

applyFiltersBtn.addEventListener('click', applyEntryFilters)
resetFiltersBtn.addEventListener('click', resetFilters)

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

  const { data, error } = await supabase.from('disciplines').insert([{ user_id: user.id, name }]).select('id, name').single()
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

  closeDisciplinePanel()
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
    .insert([{
      user_id: user.id,
      name,
      type: newWeaponType.value.trim() || null,
      caliber: newWeaponCaliber.value.trim() || null,
      notes: newWeaponNotes.value.trim() || null,
    }])
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

  closeWeaponPanel()
})

saveEntryBtn.addEventListener('click', async () => {
  entryStatus.textContent = editingEntryId ? 'Speichere Änderungen...' : 'Speichere Eintrag...'
  const user = await getCurrentUser()

  if (!user) {
    entryStatus.textContent = 'Nicht eingeloggt.'
    return
  }
  if (!entryDate.value) {
    entryStatus.textContent = 'Bitte ein Datum wählen.'
    return
  }

  const shotsPerSeries = Number(shotsPerSeriesInput.value)
  if (!Number.isInteger(shotsPerSeries) || shotsPerSeries < 1) {
    entryStatus.textContent = 'Bitte gültige Schuss pro Serie eingeben.'
    return
  }

  const seriesData = getSeriesData()
  const totalScore = calculateTotalScore(seriesData)

  if (!editingEntryId) {
    const { data: entryData, error: entryError } = await supabase
      .from('entries')
      .insert([{
        user_id: user.id,
        entry_date: entryDate.value,
        entry_type: entryType.value || null,
        discipline_id: entryDiscipline.value || null,
        weapon_id: entryWeapon.value || null,
        location: entryLocation.value.trim() || null,
        note: entryNote.value.trim() || null,
        total_score: totalScore,
        shots_per_series: shotsPerSeries,
      }])
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

      const { error: seriesError } = await supabase.from('entry_series').insert(seriesRows)
      if (seriesError) {
        entryStatus.textContent = `Fehler bei Serien: ${seriesError.message}`
        return
      }
    }

    localStorage.setItem(getLastWeaponKey(user.id), entryWeapon.value || '')
    localStorage.setItem(getLastDisciplineKey(user.id), entryDiscipline.value || '')

    entryStatus.textContent = 'Eintrag gespeichert.'
    resetForm()
    await loadFormData()
    await loadEntries()
    return
  }

  const { error: updateError } = await supabase
    .from('entries')
    .update({
      entry_date: entryDate.value,
      entry_type: entryType.value || null,
      discipline_id: entryDiscipline.value || null,
      weapon_id: entryWeapon.value || null,
      location: entryLocation.value.trim() || null,
      note: entryNote.value.trim() || null,
      total_score: totalScore,
      shots_per_series: shotsPerSeries,
    })
    .eq('id', editingEntryId)
    .eq('user_id', user.id)

  if (updateError) {
    entryStatus.textContent = `Fehler beim Aktualisieren: ${updateError.message}`
    return
  }

  const { error: deleteSeriesError } = await supabase.from('entry_series').delete().eq('entry_id', editingEntryId).eq('user_id', user.id)
  if (deleteSeriesError) {
    entryStatus.textContent = `Fehler beim Aktualisieren der Serien: ${deleteSeriesError.message}`
    return
  }

  if (seriesData.length > 0) {
    const seriesRows = seriesData.map((series) => ({
      entry_id: editingEntryId,
      user_id: user.id,
      series_number: series.series_number,
      score: series.score,
    }))

    const { error: insertSeriesError } = await supabase.from('entry_series').insert(seriesRows)
    if (insertSeriesError) {
      entryStatus.textContent = `Fehler beim Speichern der Serien: ${insertSeriesError.message}`
      return
    }
  }

  localStorage.setItem(getLastWeaponKey(user.id), entryWeapon.value || '')
  localStorage.setItem(getLastDisciplineKey(user.id), entryDiscipline.value || '')

  entryStatus.textContent = 'Eintrag aktualisiert.'
  resetForm()
  await loadFormData()
  await loadEntries()
})

reloadBtn.addEventListener('click', async () => {
  await loadFormData()
  await loadEntries()
})

async function init() {
  document.title = 'Shooting Book'
  resetForm()
  closeDisciplinePanel()
  closeWeaponPanel()
  activateTab('entry')
  activateStatsSubTab('summary')
  showSplash()

  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    showStage()
    showLoggedInUI(session)
    await loadFormData()
    await loadEntries()
  }
}

init()
