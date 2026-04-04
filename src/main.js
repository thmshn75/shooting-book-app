import './style.css'
import { createClient } from '@supabase/supabase-js'
import { utils, writeFileXLSX } from 'xlsx'

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

                <div id="training-duration-wrap" class="training-duration-wrap" style="display:none;">
                  <label for="training-duration-minutes">Trainingsdauer (Minuten)</label>
                  <select id="training-duration-minutes" class="uniform-input">
                    <option value="">Dauer auswählen</option>
                    <option value="30">30 Minuten</option>
                    <option value="60">60 Minuten</option>
                    <option value="90">90 Minuten</option>
                    <option value="120">120 Minuten</option>
                  </select>
                </div>

                <div class="location-input-row">
                  <input id="entry-location" class="uniform-input" type="text" placeholder="Ort" />
                  <button id="use-location-btn" type="button" class="location-btn">Standort übernehmen</button>
                </div>

                <input id="entry-note" class="uniform-input" type="text" placeholder="Notiz" />
              </div>

              <div class="manage-box">
                <div class="entry-blocks-header">
                  <div>
                    <h3>Blöcke & Serien</h3>
                    <p class="entry-muted-text">Jeder Block kann eigene Waffe, Disziplin, Schuss pro Serie und Serien haben.</p>
                  </div>
                  <div class="entry-blocks-actions">
                    <button id="expand-all-blocks-btn" type="button">Alle aufklappen</button>
                    <button id="collapse-all-blocks-btn" type="button">Alle einklappen</button>
                    <button id="add-block-btn" type="button">Weiteren Block hinzufügen</button>
                  </div>
                </div>
                <div id="entry-blocks"></div>
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
                    <div class="sub-manage-block">
                      <h4 class="mini-section-title">Disziplin löschen</h4>
                      <div class="form-grid mobile-single-grid">
                        <select id="delete-discipline-select" class="uniform-input">
                          <option value="">Disziplin auswählen</option>
                        </select>
                        <button id="delete-discipline-btn" type="button" class="danger-soft-btn">Disziplin löschen</button>
                      </div>
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
                    <div class="sub-manage-block">
                      <h4 class="mini-section-title">Waffe löschen</h4>
                      <div class="form-grid mobile-single-grid">
                        <select id="delete-weapon-select" class="uniform-input">
                          <option value="">Waffe auswählen</option>
                        </select>
                        <button id="delete-weapon-btn" type="button" class="danger-soft-btn">Waffe löschen</button>
                      </div>
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

              <div class="tabs-bar sub-tabs compact-sub-tabs">
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

              <div class="collapsible-box filter-collapsible-box stats-filter-collapsible-box">
                <button id="toggle-stats-filter-panel-btn" type="button" class="section-toggle-btn">
                  + Statistik-Filter anzeigen
                </button>
                <div id="stats-filter-panel" class="collapsible-panel" style="display:none;">
                  <div class="manage-box filter-box">
                    <h3>Statistik-Filter</h3>
                    <div class="form-grid mobile-single-grid">
                      <select id="stats-filter-year" class="uniform-input">
                        <option value="">Alle Jahre</option>
                      </select>

                      <select id="stats-filter-month" class="uniform-input">
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

                      <select id="stats-filter-type" class="uniform-input">
                        <option value="">Alle Typen</option>
                        <option value="training">Training</option>
                        <option value="competition">Bewerb</option>
                      </select>

                      <select id="stats-filter-discipline" class="uniform-input">
                        <option value="">Alle Disziplinen</option>
                      </select>

                      <select id="stats-filter-weapon" class="uniform-input">
                        <option value="">Alle Waffen</option>
                      </select>
                    </div>

                    <div class="row filter-actions vertical-mobile-row">
                      <button id="apply-stats-filters-btn" type="button">Filter anwenden</button>
                      <button id="reset-stats-filters-btn" type="button">Filter zurücksetzen</button>
                    </div>
                  </div>
                </div>
              </div>

              <div id="stats-filter-summary" class="list-summary compact-summary-chips"></div>

                <div class="row filter-actions export-action-row vertical-mobile-row">
                  <button id="export-stats-filtered-btn" type="button">Gefilterte Statistik exportieren</button>
                  <button id="export-stats-all-btn" type="button">Gesamtstatistik exportieren</button>
                </div>

                <p id="stats-export-status"></p>

            </div>
          </section>

          <section id="list-tab" class="tab-panel">
            <div id="list-box">
              <h2>Meine Einträge</h2>

              <div class="collapsible-box filter-collapsible-box">
                <button id="toggle-list-filter-panel-btn" type="button" class="section-toggle-btn">
                  + Filter anzeigen
                </button>
                <div id="list-filter-panel" class="collapsible-panel" style="display:none;">
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
                    </div>
                  </div>
                </div>

                <div id="list-summary" class="list-summary"></div>

                <div class="row filter-actions export-action-row vertical-mobile-row">
                  <button id="export-list-filtered-btn" type="button">Gefilterte Einträge exportieren</button>
                  <button id="export-list-all-btn" type="button">Alle Einträge exportieren</button>
                </div>

                <p id="list-export-status"></p>
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
const mainTabs = document.querySelector('.main-tabs')
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
const entryBox = document.getElementById('entry-box')
const entryDate = document.getElementById('entry-date')
const entryType = document.getElementById('entry-type')
const entryLocation = document.getElementById('entry-location')
const useLocationBtn = document.getElementById('use-location-btn')
const entryNote = document.getElementById('entry-note')
const trainingDurationWrap = document.getElementById('training-duration-wrap')
const trainingDurationMinutesInput = document.getElementById('training-duration-minutes')
const entryBlocks = document.getElementById('entry-blocks')
const addBlockBtn = document.getElementById('add-block-btn')
const expandAllBlocksBtn = document.getElementById('expand-all-blocks-btn')
const collapseAllBlocksBtn = document.getElementById('collapse-all-blocks-btn')
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

const statsFilterYear = document.getElementById('stats-filter-year')
const statsFilterMonth = document.getElementById('stats-filter-month')
const statsFilterType = document.getElementById('stats-filter-type')
const statsFilterDiscipline = document.getElementById('stats-filter-discipline')
const statsFilterWeapon = document.getElementById('stats-filter-weapon')
const applyStatsFiltersBtn = document.getElementById('apply-stats-filters-btn')
const resetStatsFiltersBtn = document.getElementById('reset-stats-filters-btn')
const statsFilterSummary = document.getElementById('stats-filter-summary')
const exportStatsFilteredBtn = document.getElementById('export-stats-filtered-btn')
const exportStatsAllBtn = document.getElementById('export-stats-all-btn')
const statsExportStatus = document.getElementById('stats-export-status')

const filterType = document.getElementById('filter-type')
const filterYear = document.getElementById('filter-year')
const filterMonth = document.getElementById('filter-month')
const filterDiscipline = document.getElementById('filter-discipline')
const filterWeapon = document.getElementById('filter-weapon')
const applyFiltersBtn = document.getElementById('apply-filters-btn')
const resetFiltersBtn = document.getElementById('reset-filters-btn')
const exportListFilteredBtn = document.getElementById('export-list-filtered-btn')
const exportListAllBtn = document.getElementById('export-list-all-btn')
const listExportStatus = document.getElementById('list-export-status')
const listSummary = document.getElementById('list-summary')


const toggleDisciplinePanelBtn = document.getElementById('toggle-discipline-panel-btn')
const disciplinePanel = document.getElementById('discipline-panel')
const newDisciplineName = document.getElementById('new-discipline-name')
const addDisciplineBtn = document.getElementById('add-discipline-btn')
const deleteDisciplineSelect = document.getElementById('delete-discipline-select')
const deleteDisciplineBtn = document.getElementById('delete-discipline-btn')
const disciplineStatus = document.getElementById('discipline-status')

const toggleWeaponPanelBtn = document.getElementById('toggle-weapon-panel-btn')
const weaponPanel = document.getElementById('weapon-panel')
const newWeaponName = document.getElementById('new-weapon-name')
const newWeaponType = document.getElementById('new-weapon-type')
const newWeaponCaliber = document.getElementById('new-weapon-caliber')
const newWeaponNotes = document.getElementById('new-weapon-notes')
const addWeaponBtn = document.getElementById('add-weapon-btn')
const deleteWeaponSelect = document.getElementById('delete-weapon-select')
const deleteWeaponBtn = document.getElementById('delete-weapon-btn')
const weaponStatus = document.getElementById('weapon-status')

const toggleStatsFilterPanelBtn = document.getElementById('toggle-stats-filter-panel-btn')
const statsFilterPanel = document.getElementById('stats-filter-panel')
const toggleListFilterPanelBtn = document.getElementById('toggle-list-filter-panel-btn')
const listFilterPanel = document.getElementById('list-filter-panel')

let editingEntryId = null
let editingOriginTab = 'entry'
let allEntriesCache = []
let disciplinesCache = []
let weaponsCache = []

const statusResetTimers = new WeakMap()

function clearStatus(element) {
  if (!element) return
  const existingTimer = statusResetTimers.get(element)
  if (existingTimer) {
    clearTimeout(existingTimer)
    statusResetTimers.delete(element)
  }
  element.textContent = ''
  element.dataset.status = ''
}

function setStatus(element, message, type = 'info', options = {}) {
  if (!element) return

  const { autoClear = false, delay = 3200 } = options
  const existingTimer = statusResetTimers.get(element)
  if (existingTimer) {
    clearTimeout(existingTimer)
    statusResetTimers.delete(element)
  }

  element.textContent = message || ''
  element.dataset.status = message ? type : ''

  if (message && autoClear) {
    const timer = window.setTimeout(() => {
      element.textContent = ''
      element.dataset.status = ''
      statusResetTimers.delete(element)
    }, delay)
    statusResetTimers.set(element, timer)
  }
}

function clearExportStatuses() {
  clearStatus(statsExportStatus)
  clearStatus(listExportStatus)
  updateEditingUiState()
}

function updateEditingUiState() {
  const isEditing = Boolean(editingEntryId)
  const fromList = isEditing && editingOriginTab === 'list'

  document.body.classList.toggle('editing-mode', isEditing)
  mainTabs?.classList.toggle('is-editing', isEditing)
  entryTab?.classList.toggle('is-editing', isEditing)
  listTab?.classList.toggle('is-editing-origin', fromList)
  entryBox?.classList.toggle('is-editing', isEditing)
  tabEntryBtn?.classList.toggle('is-editing', isEditing)
  tabEntryBtn?.classList.toggle('is-editing-focus', isEditing)
  tabListBtn?.classList.toggle('is-editing-origin', fromList)
  saveEntryBtn?.classList.toggle('is-editing', isEditing)
  cancelEditBtn?.classList.toggle('is-editing', isEditing)
}

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
  statsFilterSummary.innerHTML = ''
  clearStatus(statsExportStatus)
  clearStatus(listExportStatus)
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

function naturalCompare(a, b) {
  return String(a || '').localeCompare(String(b || ''), 'de', {
    numeric: true,
    sensitivity: 'base',
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

function openStatsFilterPanel() {
  setCollapsibleState(toggleStatsFilterPanelBtn, statsFilterPanel, true, '− Statistik-Filter ausblenden', '+ Statistik-Filter anzeigen')
}

function closeStatsFilterPanel() {
  setCollapsibleState(toggleStatsFilterPanelBtn, statsFilterPanel, false, '− Statistik-Filter ausblenden', '+ Statistik-Filter anzeigen')
}

function openListFilterPanel() {
  setCollapsibleState(toggleListFilterPanelBtn, listFilterPanel, true, '− Filter ausblenden', '+ Filter anzeigen')
}

function closeListFilterPanel() {
  setCollapsibleState(toggleListFilterPanelBtn, listFilterPanel, false, '− Filter ausblenden', '+ Filter anzeigen')
}

function renderStatsTable(container, rows, emptyText, options = {}) {
  if (!rows.length) {
    container.innerHTML = `<p>${emptyText}</p>`
    return
  }

  const {
    countLabel = 'Einträge',
    averageLabel = 'Schnitt/Eintrag',
    countKey = 'entries',
    averageKey = 'averagePerEntry',
  } = options

  container.innerHTML = `
    <div class="stats-table desktop-stats-table">
      <div class="stats-table-head">
        <div>Name</div>
        <div>${countLabel}</div>
        <div>Serien</div>
        <div>Gesamt</div>
        <div>${averageLabel}</div>
      </div>
      ${rows.map((row) => `
        <div class="stats-table-row">
          <div>${row.name}</div>
          <div>${row[countKey] ?? 0}</div>
          <div>${row.series}</div>
          <div>${formatNumber(row.total)}</div>
          <div>${formatNumber(row[averageKey] ?? 0)}</div>
        </div>
      `).join('')}
    </div>
    <div class="stats-mobile-cards">
      ${rows.map((row) => `
        <div class="stats-mobile-card">
          <div class="stats-mobile-card-title">${row.name}</div>
          <div class="stats-mobile-card-grid">
            <div><span>${countLabel}</span><strong>${row[countKey] ?? 0}</strong></div>
            <div><span>Serien</span><strong>${row.series}</strong></div>
            <div><span>Gesamt</span><strong>${formatNumber(row.total)}</strong></div>
            <div><span>${averageLabel}</span><strong>${formatNumber(row[averageKey] ?? 0)}</strong></div>
          </div>
        </div>
      `).join('')}
    </div>
  `
}

function getAllBlocks(entries) {
  return entries.flatMap((entry) =>
    (entry.entry_blocks || []).map((block) => ({
      ...block,
      parent_entry_id: entry.id,
      parent_entry_date: entry.entry_date,
      parent_entry_type: entry.entry_type,
    }))
  )
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

function buildGroupedBlockStats(entries, getGroupName) {
  const groups = new Map()

  getAllBlocks(entries).forEach((block) => {
    const name = getGroupName(block) || '-'
    if (!groups.has(name)) groups.set(name, { name, blocks: 0, series: 0, total: 0 })

    const group = groups.get(name)
    group.blocks += 1
    group.series += Array.isArray(block.entry_series) ? block.entry_series.length : 0
    group.total += Number(block.total_score || 0)
  })

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      averagePerBlock: group.blocks > 0 ? group.total / group.blocks : 0,
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

function getFilteredStatsEntries() {
  return allEntriesCache.filter((entry) => {
    const entryDateObj = entry.entry_date ? new Date(entry.entry_date) : null
    const entryYear = entryDateObj ? String(entryDateObj.getFullYear()) : ''
    const entryMonth = entryDateObj ? String(entryDateObj.getMonth() + 1) : ''

    if (statsFilterYear.value && entryYear !== statsFilterYear.value) return false
    if (statsFilterMonth.value && entryMonth !== statsFilterMonth.value) return false
    if (statsFilterType.value && entry.entry_type !== statsFilterType.value) return false
    if (!entryMatchesDiscipline(entry, statsFilterDiscipline.value)) return false
    if (!entryMatchesWeapon(entry, statsFilterWeapon.value)) return false

    return true
  })
}

function renderStatsFilterSummary(entries) {
  const trainingCount = entries.filter((entry) => entry.entry_type === 'training').length
  const competitionCount = entries.filter((entry) => entry.entry_type === 'competition').length
  const dates = entries.map((entry) => entry.entry_date).filter(Boolean).sort()

  let periodText = 'Zeitraum: alle'
  if (dates.length > 0) {
    periodText = `Zeitraum: ${formatDate(dates[0])} bis ${formatDate(dates[dates.length - 1])}`
  }

  statsFilterSummary.innerHTML = `
    <div class="summary-chip"><strong>Gefilterte Einträge:</strong> ${entries.length}</div>
    <div class="summary-chip"><strong>Training:</strong> ${trainingCount}</div>
    <div class="summary-chip"><strong>Bewerb:</strong> ${competitionCount}</div>
    <div class="summary-chip"><strong>${periodText}</strong></div>
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
  renderStatsFilterSummary(entries)

  if (!entries.length) {
    statsSummary.innerHTML = '<p>Keine Daten für den aktuellen Filter.</p>'
    statsByType.innerHTML = '<p>Keine Daten für den aktuellen Filter.</p>'
    statsByDiscipline.innerHTML = '<p>Keine Daten für den aktuellen Filter.</p>'
    statsByWeapon.innerHTML = '<p>Keine Daten für den aktuellen Filter.</p>'
    renderCharts([])
    return
  }

  const sessionCount = entries.length
  const blockCount = getAllBlocks(entries).length
  const seriesCount = entries.reduce((sum, entry) => sum + (Array.isArray(entry.entry_series) ? entry.entry_series.length : 0), 0)
  const totalScore = entries.reduce((sum, entry) => sum + Number(entry.total_score || 0), 0)
  const averagePerSession = sessionCount > 0 ? totalScore / sessionCount : 0
  const averagePerBlock = blockCount > 0 ? totalScore / blockCount : 0
  const averagePerSeries = seriesCount > 0 ? totalScore / seriesCount : 0
  const bestEntry = [...entries].sort((a, b) => Number(b.total_score || 0) - Number(a.total_score || 0))[0]
  const bestEntryText = bestEntry ? `${formatNumber(bestEntry.total_score || 0)} am ${formatDate(bestEntry.entry_date)}` : '-'

  statsSummary.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Sessions</div>
      <div class="stat-value">${sessionCount}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Blöcke</div>
      <div class="stat-value">${blockCount}</div>
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
      <div class="stat-label">Schnitt / Session</div>
      <div class="stat-value">${formatNumber(averagePerSession)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Schnitt / Block</div>
      <div class="stat-value">${formatNumber(averagePerBlock)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Schnitt / Serie</div>
      <div class="stat-value">${formatNumber(averagePerSeries)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Beste Session</div>
      <div class="stat-value small">${bestEntryText}</div>
    </div>
  `

  renderCharts(entries)
  renderStatsTable(statsByType, buildGroupedStats(entries, (entry) => formatEntryType(entry.entry_type)), 'Noch keine Typ-Daten vorhanden.')
  renderStatsTable(
    statsByDiscipline,
    buildGroupedBlockStats(entries, (block) => block.disciplines?.name || '-'),
    'Noch keine Disziplin-Daten vorhanden.',
    { countLabel: 'Blöcke', averageLabel: 'Schnitt/Block', countKey: 'blocks', averageKey: 'averagePerBlock' }
  )
  renderStatsTable(
    statsByWeapon,
    buildGroupedBlockStats(entries, (block) => {
      if (!block.weapons?.name) return '-'
      const details = [block.weapons.type, block.weapons.caliber].filter(Boolean).join(' | ')
      return details ? `${block.weapons.name} (${details})` : block.weapons.name
    }),
    'Noch keine Waffen-Daten vorhanden.',
    { countLabel: 'Blöcke', averageLabel: 'Schnitt/Block', countKey: 'blocks', averageKey: 'averagePerBlock' }
  )
}

function applyStatsFilters() {
  clearStatus(statsExportStatus)
  renderStatistics(getFilteredStatsEntries())
}

async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}


function getWeaponDisplayName(weapon) {
  if (!weapon?.name) return ''
  const details = [weapon.type, weapon.caliber].filter(Boolean).join(' | ')
  return details ? `${weapon.name} (${details})` : weapon.name
}

function getEmptyBlockData() {
  return {
    discipline_id: '',
    weapon_id: '',
    shots_per_series: '',
    note: '',
    series_count: 1,
    series_scores: [''],
    is_collapsed: false,
  }
}

function getNextBlockDefaults(previousBlock) {
  if (!previousBlock) return getEmptyBlockData()

  return {
    discipline_id: previousBlock.discipline_id || '',
    weapon_id: previousBlock.weapon_id || '',
    shots_per_series: previousBlock.shots_per_series ?? '',
    note: previousBlock.note || '',
    series_count: Math.min(Math.max(Number(previousBlock.series_count) || 1, 1), 20),
    series_scores: [''],
    is_collapsed: false,
  }
}


function getDisciplineNameById(disciplineId) {
  return disciplinesCache.find((discipline) => String(discipline.id) === String(disciplineId))?.name || 'Ohne Disziplin'
}

function getWeaponNameById(weaponId) {
  const weapon = weaponsCache.find((item) => String(item.id) === String(weaponId))
  return weapon ? getWeaponDisplayName(weapon) : 'Ohne Waffe'
}

function getBlockTotalScore(block) {
  return (block.series_scores || []).reduce((sum, value) => {
    const score = Number(value)
    return Number.isFinite(score) ? sum + score : sum
  }, 0)
}

function updateTrainingDurationVisibility() {
  const isTraining = entryType.value === 'training'
  trainingDurationWrap.style.display = isTraining ? 'block' : 'none'
  if (!isTraining) trainingDurationMinutesInput.value = ''
}

function getBlockDisciplineOptions(selectedValue = '') {
  return [
    '<option value="">Disziplin auswählen</option>',
    ...disciplinesCache.map((discipline) => {
      const selected = String(discipline.id) === String(selectedValue) ? ' selected' : ''
      return `<option value="${discipline.id}"${selected}>${discipline.name}</option>`
    }),
  ].join('')
}

function getBlockWeaponOptions(selectedValue = '') {
  return [
    '<option value="">Waffe auswählen</option>',
    ...weaponsCache.map((weapon) => {
      const selected = String(weapon.id) === String(selectedValue) ? ' selected' : ''
      return `<option value="${weapon.id}"${selected}>${getWeaponDisplayName(weapon)}</option>`
    }),
  ].join('')
}

function buildSeriesInputsMarkup(scores, count, blockIndex) {
  const items = []
  const safeCount = Math.min(Math.max(Number(count) || 1, 1), 20)

  for (let i = 1; i <= safeCount; i += 1) {
    const value = scores[i - 1] ?? ''
    items.push(`
      <div class="series-row">
        <label for="block-${blockIndex}-series-${i}">Serie ${i}</label>
        <input
          id="block-${blockIndex}-series-${i}"
          class="uniform-input block-series-score-input"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          placeholder="Score"
          data-block-index="${blockIndex}"
          data-series-number="${i}"
          value="${value}"
        />
      </div>
    `)
  }

  return items.join('')
}

function renderEntryBlocks(blocks = [getEmptyBlockData()], options = {}) {
  const { focusLastBlock = false } = options
  const normalizedBlocks = (Array.isArray(blocks) && blocks.length ? blocks : [getEmptyBlockData()]).map((block, index, arr) => ({
    ...getEmptyBlockData(),
    ...block,
    is_collapsed: arr.length > 1 ? Boolean(block?.is_collapsed) : false,
  }))
  const allowMultipleBlocks = entryType.value === 'training'

  entryBlocks.innerHTML = normalizedBlocks.map((block, index) => {
    const blockNumber = index + 1
    const seriesCount = Math.min(Math.max(Number(block.series_count) || Number(block.series_scores?.length) || 1, 1), 20)
    const seriesScores = Array.from({ length: seriesCount }, (_, scoreIndex) => block.series_scores?.[scoreIndex] ?? '')
    const canDelete = allowMultipleBlocks && normalizedBlocks.length > 1
    const isCollapsed = normalizedBlocks.length > 1 ? Boolean(block.is_collapsed) : false
    const totalScore = getBlockTotalScore({ ...block, series_scores: seriesScores })
    const summaryDiscipline = getDisciplineNameById(block.discipline_id)
    const summaryWeapon = getWeaponNameById(block.weapon_id)

    return `
      <div class="entry-block-card ${isCollapsed ? 'is-collapsed' : 'is-expanded is-active'}" data-block-index="${index}" data-collapsed="${isCollapsed ? '1' : '0'}" data-active="${isCollapsed ? '0' : '1'}">
        <div class="entry-block-top">
          <button type="button" class="block-toggle-btn" data-block-index="${index}" aria-expanded="${isCollapsed ? 'false' : 'true'}">
            <div class="entry-block-heading-row">
              <div class="entry-block-title">Block ${blockNumber}</div>
              <div class="entry-block-summary-inline">${summaryDiscipline} · ${summaryWeapon}</div>
            </div>
            <div class="entry-block-summary-chips">
              <span class="entry-block-chip">${seriesCount} Serien</span>
              <span class="entry-block-chip">${totalScore} Punkte</span>
              <span class="entry-block-chip">${isCollapsed ? 'Details anzeigen' : 'Details ausblenden'}</span>
            </div>
          </button>
          ${canDelete ? `<button type="button" class="danger-soft-btn delete-block-btn" data-block-index="${index}">Block löschen</button>` : ''}
        </div>

        <div class="entry-block-panel" style="display:${isCollapsed ? 'none' : 'block'};">
          <div class="form-grid mobile-single-grid">
            <select class="uniform-input block-discipline-select" data-block-index="${index}">
              ${getBlockDisciplineOptions(block.discipline_id)}
            </select>

            <select class="uniform-input block-weapon-select" data-block-index="${index}">
              ${getBlockWeaponOptions(block.weapon_id)}
            </select>

            <input
              class="uniform-input block-shots-input"
              data-block-index="${index}"
              type="number"
              min="1"
              max="50"
              placeholder="Schuss pro Serie"
              value="${block.shots_per_series ?? ''}"
            />

            <input
              class="uniform-input block-series-count-input"
              data-block-index="${index}"
              type="number"
              min="1"
              max="20"
              value="${seriesCount}"
            />

            <input
              class="uniform-input block-note-input"
              data-block-index="${index}"
              type="text"
              placeholder="Block-Notiz"
              value="${block.note ?? ''}"
            />
          </div>

          <div class="block-series-inputs" data-block-index="${index}">
            ${buildSeriesInputsMarkup(seriesScores, seriesCount, index)}
          </div>
        </div>
      </div>
    `
  }).join('')

  addBlockBtn.style.display = allowMultipleBlocks ? 'inline-flex' : 'none'

  document.querySelectorAll('.block-toggle-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const blockIndex = Number(button.dataset.blockIndex)
      const currentBlocks = getBlockDataFromForm({ allowIncomplete: true })
      const targetBlock = currentBlocks[blockIndex] || getEmptyBlockData()
      targetBlock.is_collapsed = !Boolean(targetBlock.is_collapsed)
      currentBlocks[blockIndex] = targetBlock
      renderEntryBlocks(currentBlocks)
    })
  })

  document.querySelectorAll('.block-series-count-input').forEach((input) => {
    const rerenderBlock = () => {
      const blockIndex = Number(input.dataset.blockIndex)
      const currentBlocks = getBlockDataFromForm({ allowIncomplete: true })
      const block = currentBlocks[blockIndex] || getEmptyBlockData()
      let count = Number(input.value)
      if (!Number.isInteger(count) || count < 1) count = 1
      if (count > 20) count = 20
      block.series_count = count
      block.series_scores = Array.from({ length: count }, (_, idx) => block.series_scores?.[idx] ?? '')
      block.is_collapsed = false
      currentBlocks[blockIndex] = block
      renderEntryBlocks(currentBlocks)
    }

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        rerenderBlock()
      }
    })
    input.addEventListener('blur', rerenderBlock)
  })

  document.querySelectorAll('.delete-block-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (!window.confirm('Diesen Block wirklich löschen?')) return
      const blockIndex = Number(button.dataset.blockIndex)
      const currentBlocks = getBlockDataFromForm({ allowIncomplete: true })
      currentBlocks.splice(blockIndex, 1)
      const nextBlocks = currentBlocks.length ? currentBlocks : [getEmptyBlockData()]
      nextBlocks[nextBlocks.length - 1].is_collapsed = false
      renderEntryBlocks(nextBlocks)
    })
  })

  document.querySelectorAll('.block-series-score-input').forEach((input) => {
    input.addEventListener('input', () => {
      const blockIndex = Number(input.dataset.blockIndex)
      const blockInputs = Array.from(document.querySelectorAll(`.block-series-score-input[data-block-index="${blockIndex}"]`))
      const index = blockInputs.indexOf(input)
      if (input.value.trim().length >= 2 && index >= 0 && index < blockInputs.length - 1) {
        blockInputs[index + 1].focus()
        blockInputs[index + 1].select()
      }
    })
  })

  if (focusLastBlock) {
    const lastCard = entryBlocks.querySelector('.entry-block-card:last-child')
    const lastField = entryBlocks.querySelector('.entry-block-card:last-child .block-discipline-select')
    if (lastCard) {
      setTimeout(() => {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
        if (lastField) lastField.focus()
      }, 50)
    }
  }
}

function getBlockDataFromForm(options = {}) {
  const { allowIncomplete = false } = options
  const blocks = []

  document.querySelectorAll('.entry-block-card').forEach((card) => {
    const blockIndex = Number(card.dataset.blockIndex)
    const disciplineId = card.querySelector('.block-discipline-select')?.value || ''
    const weaponId = card.querySelector('.block-weapon-select')?.value || ''
    const shotsValue = card.querySelector('.block-shots-input')?.value || ''
    const note = card.querySelector('.block-note-input')?.value?.trim() || ''
    const seriesCountValue = card.querySelector('.block-series-count-input')?.value || '1'
    const seriesInputs = Array.from(card.querySelectorAll('.block-series-score-input'))
    const isCollapsed = card.dataset.collapsed === '1'
    const series = seriesInputs
      .map((input) => {
        const value = input.value.trim()
        if (value === '') return null
        const score = Number(value)
        if (!Number.isFinite(score)) return null
        return {
          series_number: Number(input.dataset.seriesNumber),
          score,
        }
      })
      .filter(Boolean)

    const shotsPerSeries = shotsValue === '' ? null : Number(shotsValue)
    const seriesCount = Math.min(Math.max(Number(seriesCountValue) || 1, 1), 20)

    if (!allowIncomplete) {
      if (!Number.isInteger(shotsPerSeries) || shotsPerSeries < 1) {
        throw new Error(`Bitte gültige Schuss pro Serie in Block ${blockIndex + 1} eingeben.`)
      }
    }

    blocks.push({
      block_order: blockIndex + 1,
      discipline_id: disciplineId || null,
      weapon_id: weaponId || null,
      shots_per_series: shotsPerSeries,
      note: note || null,
      series_count: seriesCount,
      series_scores: Array.from({ length: seriesCount }, (_, idx) => seriesInputs[idx]?.value ?? ''),
      series,
      total_score: calculateTotalScore(series),
      is_collapsed: isCollapsed,
    })
  })

  return blocks
}

function calculateTotalScore(seriesData) {
  return (seriesData || []).reduce((sum, item) => sum + Number(item.score || 0), 0)
}

function calculateSessionTotalScore(blocks = []) {
  return blocks.reduce((sum, block) => sum + Number(block.total_score || 0), 0)
}

function normalizeEntryForUi(entry) {
  const blocks = Array.isArray(entry.entry_blocks) ? [...entry.entry_blocks] : []
  blocks.sort((a, b) => Number(a.block_order || 0) - Number(b.block_order || 0))

  blocks.forEach((block) => {
    block.entry_series = Array.isArray(block.entry_series) ? [...block.entry_series].sort((a, b) => a.series_number - b.series_number) : []
    block.total_score = Number(block.total_score || calculateTotalScore(block.entry_series))
  })

  const sessionTotal = calculateSessionTotalScore(blocks)
  const firstBlock = blocks[0] || null

  return {
    ...entry,
    entry_blocks: blocks,
    total_score: sessionTotal,
    discipline_id: firstBlock?.discipline_id || null,
    weapon_id: firstBlock?.weapon_id || null,
    disciplines: firstBlock?.disciplines || null,
    weapons: firstBlock?.weapons || null,
    shots_per_series: firstBlock?.shots_per_series || null,
    entry_series: blocks.flatMap((block) => block.entry_series || []),
  }
}

function entryMatchesDiscipline(entry, disciplineId) {
  if (!disciplineId) return true
  return (entry.entry_blocks || []).some((block) => String(block.discipline_id || '') === String(disciplineId))
}

function entryMatchesWeapon(entry, weaponId) {
  if (!weaponId) return true
  return (entry.entry_blocks || []).some((block) => String(block.weapon_id || '') === String(weaponId))
}
function normalizeDuplicateValue(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('de-AT')
}

async function findExistingDiscipline(userId, name) {
  const { data, error } = await supabase
    .from('disciplines')
    .select('id, name')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) return { data: null, error }

  const normalizedName = normalizeDuplicateValue(name)
  const existing = (data || []).find((item) => normalizeDuplicateValue(item.name) === normalizedName) || null
  return { data: existing, error: null }
}

async function findExistingWeapon(userId, weaponInput) {
  const { data, error } = await supabase
    .from('weapons')
    .select('id, name, type, caliber')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) return { data: null, error }

  const normalizedName = normalizeDuplicateValue(weaponInput.name)
  const normalizedType = normalizeDuplicateValue(weaponInput.type)
  const normalizedCaliber = normalizeDuplicateValue(weaponInput.caliber)

  const existing = (data || []).find((item) =>
    normalizeDuplicateValue(item.name) === normalizedName &&
    normalizeDuplicateValue(item.type) === normalizedType &&
    normalizeDuplicateValue(item.caliber) === normalizedCaliber
  ) || null

  return { data: existing, error: null }
}

function resetForm(options = {}) {
  const {
    preserveDate = false,
    preserveType = false,
    preserveDuration = false,
    preserveBlocks = false,
  } = options

  const nextDate = preserveDate ? entryDate.value || todayString() : todayString()
  const nextType = preserveType ? entryType.value || 'training' : 'training'
  const nextDuration = preserveDuration ? trainingDurationMinutesInput.value || '' : ''
  const nextBlocks = preserveBlocks ? getBlockDataFromForm({ allowIncomplete: true }) : [getEmptyBlockData()]

  editingEntryId = null
  editingOriginTab = 'entry'
  formTitle.textContent = 'Neuer Eintrag'
  saveEntryBtn.textContent = 'Eintrag speichern'
  cancelEditBtn.style.display = 'none'
  clearStatus(entryStatus)

  entryDate.value = nextDate
  entryType.value = nextType
  entryLocation.value = ''
  entryNote.value = ''
  trainingDurationMinutesInput.value = nextDuration

  updateTrainingDurationVisibility()
  renderEntryBlocks(nextBlocks, { focusLastBlock: false })
  updateEditingUiState()
}

function populateAllFilterOptions(entries) {
  const years = [...new Set(entries.map((entry) => (entry.entry_date ? new Date(entry.entry_date).getFullYear() : null)).filter(Boolean))].sort((a, b) => b - a)

  const disciplineMap = new Map()
  const weaponMap = new Map()

  entries.forEach((entry) => {
    ;(entry.entry_blocks || []).forEach((block) => {
      if (block.discipline_id && block.disciplines?.name) disciplineMap.set(block.discipline_id, block.disciplines.name)
      if (block.weapon_id && block.weapons?.name) weaponMap.set(block.weapon_id, getWeaponDisplayName(block.weapons))
    })
  })

  const disciplines = [...disciplineMap.entries()].sort((a, b) => naturalCompare(a[1], b[1]))
  const weapons = [...weaponMap.entries()].sort((a, b) => naturalCompare(a[1], b[1]))

  const fillSelect = (select, firstLabel, items, currentValue) => {
    select.innerHTML = `<option value="">${firstLabel}</option>`
    items.forEach(([value, label]) => {
      const option = document.createElement('option')
      option.value = String(value)
      option.textContent = String(label)
      if (String(value) === String(currentValue)) option.selected = true
      select.appendChild(option)
    })
  }

  fillSelect(filterYear, 'Alle Jahre', years.map((year) => [year, year]), filterYear.value)
  fillSelect(statsFilterYear, 'Alle Jahre', years.map((year) => [year, year]), statsFilterYear.value)

  fillSelect(filterDiscipline, 'Alle Disziplinen', disciplines, filterDiscipline.value)
  fillSelect(statsFilterDiscipline, 'Alle Disziplinen', disciplines, statsFilterDiscipline.value)

  fillSelect(filterWeapon, 'Alle Waffen', weapons, filterWeapon.value)
  fillSelect(statsFilterWeapon, 'Alle Waffen', weapons, statsFilterWeapon.value)
}

function getFilteredEntries() {
  return allEntriesCache.filter((entry) => {
    const entryDateObj = entry.entry_date ? new Date(entry.entry_date) : null
    const entryYear = entryDateObj ? String(entryDateObj.getFullYear()) : ''
    const entryMonth = entryDateObj ? String(entryDateObj.getMonth() + 1) : ''

    if (filterType.value && entry.entry_type !== filterType.value) return false
    if (filterYear.value && entryYear !== filterYear.value) return false
    if (filterMonth.value && entryMonth !== filterMonth.value) return false
    if (!entryMatchesDiscipline(entry, filterDiscipline.value)) return false
    if (!entryMatchesWeapon(entry, filterWeapon.value)) return false

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
    const blocksMarkup = (entry.entry_blocks || []).map((block) => {
      const seriesMarkup = (block.entry_series || []).map((series) => `
        <div class="series-pill">
          <span class="series-pill-label">S${series.series_number}</span>
          <span class="series-pill-value">${series.score}</span>
        </div>
      `).join('')

      return `
        <div class="entry-block-summary">
          <div class="entry-block-summary-top">
            <strong>Block ${block.block_order}</strong>
            <span>${formatNumber(block.total_score || 0)}</span>
          </div>
          <div class="entry-block-summary-meta">
            <span>${block.disciplines?.name || 'Ohne Disziplin'}</span>
            <span>${block.weapons?.name ? getWeaponDisplayName(block.weapons) : 'Keine Waffe'}</span>
            <span>${block.shots_per_series || '-'} Schuss/Serie</span>
          </div>
          ${block.note ? `<div class="entry-block-note">${block.note}</div>` : ''}
          ${seriesMarkup ? `<div class="entry-series-list compact-series-list compact-mini-series-list">${seriesMarkup}</div>` : ''}
        </div>
      `
    }).join('')

    const durationMarkup = entry.entry_type === 'training' && entry.training_duration_minutes
      ? `<div class="entry-inline-info"><span class="entry-inline-label">Dauer</span><span class="entry-inline-value">${entry.training_duration_minutes} Min.</span></div>`
      : ''

    const locationMarkup = entry.location
      ? `<div class="entry-inline-info"><span class="entry-inline-label">Ort</span><span class="entry-inline-value">${entry.location}</span></div>`
      : ''

    const noteMarkup = entry.note
      ? `<div class="entry-inline-info"><span class="entry-inline-label">Notiz</span><span class="entry-inline-value">${entry.note}</span></div>`
      : ''

    const optionalInfoMarkup = [durationMarkup, locationMarkup, noteMarkup].filter(Boolean).join('')
    const blockCount = (entry.entry_blocks || []).length
    const seriesCount = (entry.entry_blocks || []).reduce((sum, block) => sum + (block.entry_series || []).length, 0)

    return `
      <div class="entry-card compact-list-card is-collapsed" data-entry-id="${entry.id}" data-collapsed="1">
        <button type="button" class="entry-card-toggle-btn" data-entry-id="${entry.id}" aria-expanded="false">
          <div class="entry-card-top compact-entry-top">
            <div class="entry-card-main">
              <div class="entry-card-date">${formatDate(entry.entry_date)}</div>
              <div class="entry-title-row">
                <span class="entry-type-badge ${entry.entry_type === 'competition' ? 'competition' : 'training'}">${formatEntryType(entry.entry_type)}</span>
                <span class="entry-discipline-name">${blockCount} Block${blockCount === 1 ? '' : 'e'}</span>
              </div>
            </div>
            <div class="entry-collapse-hint">Details anzeigen</div>
          </div>

          <div class="entry-summary-row compact-summary-row">
            <div class="entry-summary-item entry-summary-total">
              <span class="entry-summary-label">Gesamt</span>
              <strong class="entry-summary-value">${formatNumber(entry.total_score || 0)}</strong>
            </div>
            <div class="entry-summary-item">
              <span class="entry-summary-label">Blöcke</span>
              <strong class="entry-summary-value">${blockCount}</strong>
            </div>
            <div class="entry-summary-item">
              <span class="entry-summary-label">Serien</span>
              <strong class="entry-summary-value">${seriesCount}</strong>
            </div>
          </div>
        </button>

        <div class="entry-card-panel" style="display:none;">
          ${optionalInfoMarkup ? `<div class="entry-inline-info-row compact-inline-info-row">${optionalInfoMarkup}</div>` : ''}
          <div class="entry-block-summary-list">${blocksMarkup}</div>

          <div class="entry-card-actions compact-entry-actions compact-action-row">
            <button class="edit-entry-btn compact-action-btn compact-small-action-btn" data-entry-id="${entry.id}">Bearbeiten</button>
            <button class="delete-entry-btn compact-action-btn compact-small-action-btn" data-entry-id="${entry.id}">Löschen</button>
          </div>
        </div>
      </div>
    `
  }).join('')

  document.querySelectorAll('.entry-card-toggle-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const entryId = button.dataset.entryId
      const card = entriesList.querySelector(`.entry-card[data-entry-id="${entryId}"]`)
      const panel = card?.querySelector('.entry-card-panel')
      if (!card || !panel) return
      const isCollapsed = card.dataset.collapsed === '1'
      card.dataset.collapsed = isCollapsed ? '0' : '1'
      card.classList.toggle('is-collapsed', !isCollapsed)
      card.classList.toggle('is-expanded', isCollapsed)
      panel.style.display = isCollapsed ? 'block' : 'none'
      button.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false')
      const hint = button.querySelector('.entry-collapse-hint')
      if (hint) hint.textContent = isCollapsed ? 'Details ausblenden' : 'Details anzeigen'
    })
  })

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
  clearStatus(listExportStatus)
  renderEntriesList(getFilteredEntries())
}

async function applyEntryFiltersAndReload() {
  clearStatus(listExportStatus)
  await loadEntries()
}

function resetFilters() {
  clearStatus(listExportStatus)
  filterType.value = ''
  filterYear.value = ''
  filterMonth.value = ''
  filterDiscipline.value = ''
  filterWeapon.value = ''
  applyEntryFilters()
}

function resetStatsFilters() {
  clearStatus(statsExportStatus)
  statsFilterYear.value = ''
  statsFilterMonth.value = ''
  statsFilterType.value = ''
  statsFilterDiscipline.value = ''
  statsFilterWeapon.value = ''
  applyStatsFilters()
}

function fillSimpleSelect(select, firstLabel, items, currentValue = '') {
  if (!select) return
  select.innerHTML = `<option value="">${firstLabel}</option>`
  items.forEach(({ value, label }) => {
    const option = document.createElement('option')
    option.value = String(value)
    option.textContent = String(label)
    if (String(value) === String(currentValue)) option.selected = true
    select.appendChild(option)
  })
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? '')
  if (/[",\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`
  return stringValue
}

function getActiveStatsFilterLabel() {
  const parts = []

  if (statsFilterYear.value) parts.push(`Jahr ${statsFilterYear.value}`)

  if (statsFilterMonth.value) {
    const monthLabel = statsFilterMonth.options[statsFilterMonth.selectedIndex]?.textContent || statsFilterMonth.value
    parts.push(`Monat ${monthLabel}`)
  }

  if (statsFilterType.value) parts.push(formatEntryType(statsFilterType.value))

  if (statsFilterDiscipline.value) {
    const disciplineLabel = statsFilterDiscipline.options[statsFilterDiscipline.selectedIndex]?.textContent || ''
    if (disciplineLabel) parts.push(`Disziplin ${disciplineLabel}`)
  }

  if (statsFilterWeapon.value) {
    const weaponLabel = statsFilterWeapon.options[statsFilterWeapon.selectedIndex]?.textContent || ''
    if (weaponLabel) parts.push(`Waffe ${weaponLabel}`)
  }

  return parts.length ? parts.join(' | ') : 'Alle Daten'
}

function getStatsPeriodText(entries) {
  const dates = entries.map((entry) => entry.entry_date).filter(Boolean).sort()
  if (!dates.length) return 'alle'
  return `${formatDate(dates[0])} bis ${formatDate(dates[dates.length - 1])}`
}

function getActiveListFilterLabel() {
  const parts = []

  if (filterType.value) parts.push(formatEntryType(filterType.value))
  if (filterYear.value) parts.push(`Jahr ${filterYear.value}`)

  if (filterMonth.value) {
    const monthLabel = filterMonth.options[filterMonth.selectedIndex]?.textContent || filterMonth.value
    parts.push(`Monat ${monthLabel}`)
  }

  if (filterDiscipline.value) {
    const disciplineLabel = filterDiscipline.options[filterDiscipline.selectedIndex]?.textContent || ''
    if (disciplineLabel) parts.push(`Disziplin ${disciplineLabel}`)
  }

  if (filterWeapon.value) {
    const weaponLabel = filterWeapon.options[filterWeapon.selectedIndex]?.textContent || ''
    if (weaponLabel) parts.push(`Waffe ${weaponLabel}`)
  }

  return parts.length ? parts.join(' | ') : 'Alle Daten'
}

function downloadTextFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function exportEntriesCsv(entries, filename = null) {
  const maxBlockCount = Math.max(1, ...entries.map((entry) => (entry.entry_blocks || []).length))
  const maxSeriesCount = Math.max(
    1,
    ...entries.flatMap((entry) => (entry.entry_blocks || []).map((block) => (block.entry_series || []).length))
  )

  const headers = [
    'Datum',
    'Typ',
    'Trainingsdauer (Minuten)',
    'Ort',
    'Notiz',
    'Blockanzahl',
    'Gesamtscore',
  ]

  for (let blockIndex = 1; blockIndex <= maxBlockCount; blockIndex += 1) {
    headers.push(
      `Block ${blockIndex} Disziplin`,
      `Block ${blockIndex} Waffe`,
      `Block ${blockIndex} Waffentyp`,
      `Block ${blockIndex} Kaliber`,
      `Block ${blockIndex} Schuss pro Serie`,
      `Block ${blockIndex} Block-Notiz`,
      `Block ${blockIndex} Block-Score`,
    )
    for (let seriesIndex = 1; seriesIndex <= maxSeriesCount; seriesIndex += 1) {
      headers.push(`Block ${blockIndex} Serie ${seriesIndex}`)
    }
  }

  const rows = entries.map((entry) => {
    const row = [
      entry.entry_date || '',
      formatEntryType(entry.entry_type),
      entry.training_duration_minutes ?? '',
      entry.location || '',
      entry.note || '',
      (entry.entry_blocks || []).length,
      entry.total_score ?? '',
    ]

    for (let blockIndex = 0; blockIndex < maxBlockCount; blockIndex += 1) {
      const block = entry.entry_blocks?.[blockIndex]
      row.push(
        block?.disciplines?.name || '',
        block?.weapons?.name || '',
        block?.weapons?.type || '',
        block?.weapons?.caliber || '',
        block?.shots_per_series ?? '',
        block?.note || '',
        block?.total_score ?? '',
      )
      for (let seriesIndex = 0; seriesIndex < maxSeriesCount; seriesIndex += 1) {
        row.push(block?.entry_series?.[seriesIndex]?.score ?? '')
      }
    }

    return row
  })

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(';'))
    .join('\n')

  const stamp = new Date().toISOString().slice(0, 10)
  const finalFilename = filename || `shooting-book-meine-eintraege-${stamp}.csv`
  downloadTextFile(finalFilename, csvContent, 'text/csv;charset=utf-8')
}

function buildEntriesWorkbookData(entries) {
  const sessionsRows = []
  const blocksRows = []
  const seriesRows = []

  entries.forEach((entry) => {
    const blocks = entry.entry_blocks || []
    const totalSeriesCount = blocks.reduce((sum, block) => sum + ((block.entry_series || []).length), 0)

    sessionsRows.push({
      Session_ID: entry.id,
      Datum: entry.entry_date || '',
      Typ: formatEntryType(entry.entry_type),
      Trainingsdauer_Minuten: entry.training_duration_minutes ?? '',
      Ort: entry.location || '',
      Notiz: entry.note || '',
      Blockanzahl: blocks.length,
      Serienanzahl_Gesamt: totalSeriesCount,
      Gesamtscore: entry.total_score ?? 0,
    })

    blocks.forEach((block) => {
      const series = block.entry_series || []

      blocksRows.push({
        Session_ID: entry.id,
        Datum: entry.entry_date || '',
        Typ: formatEntryType(entry.entry_type),
        Blocknummer: block.block_order ?? '',
        Disziplin: block.disciplines?.name || '',
        Waffe: block.weapons?.name || '',
        Waffentyp: block.weapons?.type || '',
        Kaliber: block.weapons?.caliber || '',
        Schuss_pro_Serie: block.shots_per_series ?? '',
        Block_Notiz: block.note || '',
        Serienanzahl_Block: series.length,
        Blockscore: block.total_score ?? 0,
      })

      series.forEach((seriesItem) => {
        seriesRows.push({
          Session_ID: entry.id,
          Datum: entry.entry_date || '',
          Typ: formatEntryType(entry.entry_type),
          Blocknummer: block.block_order ?? '',
          Seriennummer: seriesItem.series_number ?? '',
          Disziplin: block.disciplines?.name || '',
          Waffe: block.weapons?.name || '',
          Schuss_pro_Serie: block.shots_per_series ?? '',
          Score: seriesItem.score ?? 0,
        })
      })
    })
  })

  return { sessionsRows, blocksRows, seriesRows }
}

function exportEntriesXlsx(entries, filename = null) {
  const { sessionsRows, blocksRows, seriesRows } = buildEntriesWorkbookData(entries)

  const workbook = utils.book_new()

  const sessionsSheet = utils.json_to_sheet(sessionsRows)
  const blocksSheet = utils.json_to_sheet(blocksRows)
  const seriesSheet = utils.json_to_sheet(seriesRows)

  if (sessionsSheet['!ref']) sessionsSheet['!autofilter'] = { ref: sessionsSheet['!ref'] }
  if (blocksSheet['!ref']) blocksSheet['!autofilter'] = { ref: blocksSheet['!ref'] }
  if (seriesSheet['!ref']) seriesSheet['!autofilter'] = { ref: seriesSheet['!ref'] }

  sessionsSheet['!cols'] = [
    { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 22 }, { wch: 20 },
    { wch: 30 }, { wch: 12 }, { wch: 18 }, { wch: 14 },
  ]

  blocksSheet['!cols'] = [
    { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 20 },
    { wch: 20 }, { wch: 18 }, { wch: 14 }, { wch: 18 }, { wch: 28 },
    { wch: 18 }, { wch: 14 },
  ]

  seriesSheet['!cols'] = [
    { wch: 18 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 },
    { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 12 },
  ]

  utils.book_append_sheet(workbook, sessionsSheet, 'Sessions')
  utils.book_append_sheet(workbook, blocksSheet, 'Bloecke')
  utils.book_append_sheet(workbook, seriesSheet, 'Serien')

  const stamp = new Date().toISOString().slice(0, 10)
  const finalFilename = filename || `shooting-book-meine-eintraege-${stamp}.xlsx`

  writeFileXLSX(workbook, finalFilename)
}

function exportStatisticsCsv(entries, options = {}) {
  const { filename = null, filterLabel = null } = options
  const sessionCount = entries.length
  const blockCount = getAllBlocks(entries).length
  const seriesCount = entries.reduce((sum, entry) => sum + (Array.isArray(entry.entry_series) ? entry.entry_series.length : 0), 0)
  const totalScore = entries.reduce((sum, entry) => sum + Number(entry.total_score || 0), 0)
  const averagePerSession = sessionCount > 0 ? totalScore / sessionCount : 0
  const averagePerBlock = blockCount > 0 ? totalScore / blockCount : 0
  const averagePerSeries = seriesCount > 0 ? totalScore / seriesCount : 0
  const bestEntry = [...entries].sort((a, b) => Number(b.total_score || 0) - Number(a.total_score || 0))[0]
  const bestEntryText = bestEntry ? `${formatNumber(bestEntry.total_score || 0)} am ${formatDate(bestEntry.entry_date)}` : '-'

  const filterText = filterLabel || getActiveStatsFilterLabel()
  const periodText = getStatsPeriodText(entries)

  const lines = []

  const pushRow = (row = []) => {
    lines.push(row.map(escapeCsvValue).join(';'))
  }

  pushRow(['Shooting Book Statistik Export'])
  pushRow(['Zeitraum', periodText])
  pushRow(['Filter', filterText])
  pushRow([])

  pushRow(['Überblick'])
  pushRow(['Kennzahl', 'Wert'])
  pushRow(['Sessions', sessionCount])
  pushRow(['Blöcke', blockCount])
  pushRow(['Serien', seriesCount])
  pushRow(['Gesamtscore', formatNumber(totalScore)])
  pushRow(['Schnitt pro Session', formatNumber(averagePerSession)])
  pushRow(['Schnitt pro Block', formatNumber(averagePerBlock)])
  pushRow(['Schnitt pro Serie', formatNumber(averagePerSeries)])
  pushRow(['Beste Session', bestEntryText])
  pushRow([])

  const typeRows = buildGroupedStats(entries, (entry) => formatEntryType(entry.entry_type))
  pushRow(['Nach Typ'])
  pushRow(['Typ', 'Sessions', 'Serien', 'Gesamt', 'Schnitt pro Session'])
  if (typeRows.length) {
    typeRows.forEach((row) => {
      pushRow([row.name, row.entries, row.series, formatNumber(row.total), formatNumber(row.averagePerEntry)])
    })
  } else {
    pushRow(['Keine Daten'])
  }
  pushRow([])

  const disciplineRows = buildGroupedBlockStats(entries, (block) => block.disciplines?.name || '-')
  pushRow(['Nach Disziplin'])
  pushRow(['Disziplin', 'Blöcke', 'Serien', 'Gesamt', 'Schnitt pro Block'])
  if (disciplineRows.length) {
    disciplineRows.forEach((row) => {
      pushRow([row.name, row.blocks, row.series, formatNumber(row.total), formatNumber(row.averagePerBlock)])
    })
  } else {
    pushRow(['Keine Daten'])
  }
  pushRow([])

  const weaponRows = buildGroupedBlockStats(entries, (block) => {
    if (!block.weapons?.name) return '-'
    const details = [block.weapons.type, block.weapons.caliber].filter(Boolean).join(' | ')
    return details ? `${block.weapons.name} (${details})` : block.weapons.name
  })
  pushRow(['Nach Waffe'])
  pushRow(['Waffe', 'Blöcke', 'Serien', 'Gesamt', 'Schnitt pro Block'])
  if (weaponRows.length) {
    weaponRows.forEach((row) => {
      pushRow([row.name, row.blocks, row.series, formatNumber(row.total), formatNumber(row.averagePerBlock)])
    })
  } else {
    pushRow(['Keine Daten'])
  }

  const csvContent = lines.join('\n')
  const stamp = new Date().toISOString().slice(0, 10)
  const finalFilename = filename || `shooting-book-statistik-${stamp}.csv`
  downloadTextFile(finalFilename, csvContent, 'text/csv;charset=utf-8')
}

async function deleteDisciplineById(disciplineId) {
  setStatus(disciplineStatus, 'Prüfe Disziplin...', 'info')
  const user = await getCurrentUser()
  if (!user) {
    setStatus(disciplineStatus, 'Nicht eingeloggt.', 'error')
    return
  }
  if (!disciplineId) {
    setStatus(disciplineStatus, 'Bitte eine Disziplin auswählen.', 'error')
    return
  }

  const { count, error: countError } = await supabase
    .from('entry_blocks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('discipline_id', disciplineId)

  if (countError) {
    setStatus(disciplineStatus, `Fehler bei der Prüfung: ${countError.message}`, 'error')
    return
  }

  if ((count || 0) > 0) {
    setStatus(disciplineStatus, 'Disziplin wird bereits in Einträgen verwendet und kann nicht gelöscht werden.', 'error')
    return
  }

  if (!window.confirm('Disziplin wirklich löschen?')) {
    clearStatus(disciplineStatus)
    return
  }

  const { error } = await supabase.from('disciplines').delete().eq('id', disciplineId).eq('user_id', user.id)
  if (error) {
    setStatus(disciplineStatus, `Fehler beim Löschen: ${error.message}`, 'error')
    return
  }

  if (filterDiscipline.value === disciplineId) filterDiscipline.value = ''
  if (statsFilterDiscipline.value === disciplineId) statsFilterDiscipline.value = ''
  if (localStorage.getItem(getLastDisciplineKey(user.id)) === disciplineId) localStorage.removeItem(getLastDisciplineKey(user.id))

  setStatus(disciplineStatus, 'Disziplin gelöscht.', 'success', { autoClear: true })
  await loadFormData()
  await loadEntries()
}

async function deleteWeaponById(weaponId) {
  setStatus(weaponStatus, 'Prüfe Waffe...', 'info')
  const user = await getCurrentUser()
  if (!user) {
    setStatus(weaponStatus, 'Nicht eingeloggt.', 'error')
    return
  }
  if (!weaponId) {
    setStatus(weaponStatus, 'Bitte eine Waffe auswählen.', 'error')
    return
  }

  const { count, error: countError } = await supabase
    .from('entry_blocks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('weapon_id', weaponId)

  if (countError) {
    setStatus(weaponStatus, `Fehler bei der Prüfung: ${countError.message}`, 'error')
    return
  }

  if ((count || 0) > 0) {
    setStatus(weaponStatus, 'Waffe wird bereits in Einträgen verwendet und kann nicht gelöscht werden.', 'error')
    return
  }

  if (!window.confirm('Waffe wirklich löschen?')) {
    clearStatus(weaponStatus)
    return
  }

  const { error } = await supabase.from('weapons').delete().eq('id', weaponId).eq('user_id', user.id)
  if (error) {
    setStatus(weaponStatus, `Fehler beim Löschen: ${error.message}`, 'error')
    return
  }

  if (filterWeapon.value === weaponId) filterWeapon.value = ''
  if (statsFilterWeapon.value === weaponId) statsFilterWeapon.value = ''
  if (localStorage.getItem(getLastWeaponKey(user.id)) === weaponId) localStorage.removeItem(getLastWeaponKey(user.id))

  setStatus(weaponStatus, 'Waffe gelöscht.', 'success', { autoClear: true })
  await loadFormData()
  await loadEntries()
}

async function loadDisciplines() {
  const user = await getCurrentUser()
  if (!user) return

  const { data, error } = await supabase.from('disciplines').select('id, name').eq('user_id', user.id)
  if (error) {
    setStatus(disciplineStatus, `Fehler beim Laden der Disziplinen: ${error.message}`, 'error')
    return
  }

  const currentDeleteDisciplineValue = deleteDisciplineSelect?.value || ''
  disciplinesCache = [...(data || [])].sort((a, b) => naturalCompare(a.name, b.name))

  fillSimpleSelect(
    deleteDisciplineSelect,
    'Disziplin zum Löschen auswählen',
    disciplinesCache.map((discipline) => ({ value: discipline.id, label: discipline.name })),
    currentDeleteDisciplineValue
  )

  renderEntryBlocks(getBlockDataFromForm({ allowIncomplete: true }))
}

async function loadWeapons() {
  const user = await getCurrentUser()
  if (!user) return

  const { data, error } = await supabase.from('weapons').select('id, name, type, caliber').eq('user_id', user.id).order('name', { ascending: true })
  if (error) {
    setStatus(weaponStatus, `Fehler beim Laden der Waffen: ${error.message}`, 'error')
    return
  }

  const currentDeleteWeaponValue = deleteWeaponSelect?.value || ''
  weaponsCache = data || []

  fillSimpleSelect(
    deleteWeaponSelect,
    'Waffe zum Löschen auswählen',
    weaponsCache.map((weapon) => ({
      value: weapon.id,
      label: getWeaponDisplayName(weapon),
    })),
    currentDeleteWeaponValue
  )

  renderEntryBlocks(getBlockDataFromForm({ allowIncomplete: true }))
}

async function deleteEntry(entryId) {
  if (!window.confirm('Eintrag wirklich löschen?')) return

  setStatus(entryStatus, 'Lösche Eintrag...', 'info')
  const user = await getCurrentUser()
  if (!user) {
    setStatus(entryStatus, 'Nicht eingeloggt.', 'error')
    return
  }

  const { error: seriesError } = await supabase.from('entry_series').delete().eq('entry_id', entryId).eq('user_id', user.id)
  if (seriesError) {
    setStatus(entryStatus, `Fehler beim Löschen der Serien: ${seriesError.message}`, 'error')
    return
  }

  const { error: entryError } = await supabase.from('entries').delete().eq('id', entryId).eq('user_id', user.id)
  if (entryError) {
    setStatus(entryStatus, `Fehler beim Löschen des Eintrags: ${entryError.message}`, 'error')
    return
  }

  if (editingEntryId === entryId) {
    resetForm()
    await loadFormData()
  }

  setStatus(entryStatus, 'Eintrag gelöscht.', 'success', { autoClear: true })
  await loadEntries()
}

async function startEditEntry(entryId) {
  editingOriginTab = listTab.classList.contains('active') ? 'list' : 'entry'
  setStatus(entryStatus, 'Lade Eintrag zur Bearbeitung...', 'info')
  const user = await getCurrentUser()
  if (!user) {
    setStatus(entryStatus, 'Nicht eingeloggt.', 'error')
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
      training_duration_minutes,
      entry_blocks(
        id,
        block_order,
        weapon_id,
        discipline_id,
        shots_per_series,
        note,
        total_score,
        weapons(name, type, caliber),
        disciplines(name),
        entry_series(id, series_number, score)
      )
    `)
    .eq('id', entryId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    setStatus(entryStatus, `Fehler beim Laden des Eintrags: ${error.message}`, 'error')
    return
  }

  editingEntryId = data.id
  formTitle.textContent = 'Eintrag bearbeiten'
  saveEntryBtn.textContent = 'Änderungen speichern'
  cancelEditBtn.style.display = 'inline-block'

  entryDate.value = data.entry_date || todayString()
  entryType.value = data.entry_type || 'training'
  entryLocation.value = data.location || ''
  entryNote.value = data.note || ''
  trainingDurationMinutesInput.value = data.training_duration_minutes || ''

  updateTrainingDurationVisibility()

  const blocks = (data.entry_blocks || [])
    .sort((a, b) => Number(a.block_order || 0) - Number(b.block_order || 0))
    .map((block) => ({
      discipline_id: block.discipline_id || '',
      weapon_id: block.weapon_id || '',
      shots_per_series: block.shots_per_series || '',
      note: block.note || '',
      series_count: Math.max((block.entry_series || []).length, 1),
      series_scores: (block.entry_series || []).sort((a, b) => a.series_number - b.series_number).map((item) => item.score),
    }))

  renderEntryBlocks(blocks.length ? blocks : [getEmptyBlockData()])
  updateEditingUiState()

  activateTab('entry')
  setStatus(entryStatus, 'Bearbeitungsmodus aktiv.', 'success', { autoClear: true })
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
      training_duration_minutes,
      created_at,
      entry_blocks(
        id,
        block_order,
        weapon_id,
        discipline_id,
        shots_per_series,
        note,
        total_score,
        weapons(name, type, caliber),
        disciplines(name),
        entry_series(id, series_number, score)
      )
    `)
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    entriesList.innerHTML = `<p>Fehler beim Laden: ${error.message}</p>`
    return
  }

  allEntriesCache = (data || []).map(normalizeEntryForUi)
  populateAllFilterOptions(allEntriesCache)
  applyEntryFilters()
  applyStatsFilters()
}

async function loadFormData() {
  clearStatus(disciplineStatus)
  clearStatus(weaponStatus)
  await loadDisciplines()
  await loadWeapons()
}

startAppBtn.addEventListener('click', () => {
  showStage()
  showLoggedOutUI()
})

registerBtn.addEventListener('click', async () => {
  setStatus(authStatus, 'Registrierung läuft...', 'info')
  const { error } = await supabase.auth.signUp({
    email: emailInput.value,
    password: passwordInput.value,
  })

  if (error) {
    setStatus(authStatus, `Fehler: ${error.message}`, 'error')
    return
  }

  setStatus(authStatus, 'Registrierung erfolgreich. Bitte E-Mail bestätigen, falls aktiviert.', 'success')
})

loginBtn.addEventListener('click', async () => {
  setStatus(authStatus, 'Login läuft...', 'info')
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  })

  if (error) {
    setStatus(authStatus, `Fehler: ${error.message}`, 'error')
    return
  }

  setStatus(authStatus, 'Login erfolgreich.', 'success', { autoClear: true })
  showLoggedInUI(data.session)
  resetForm()
  closeDisciplinePanel()
  closeWeaponPanel()
  closeStatsFilterPanel()
  closeListFilterPanel()
  activateTab('entry')
  activateStatsSubTab('summary')
  await loadFormData()
  await loadEntries()
})

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut()
  setStatus(authStatus, 'Ausgeloggt.', 'success', { autoClear: true })
  showLoggedOutUI()
})

tabEntryBtn.addEventListener('click', () => activateTab('entry'))
tabStatsBtn.addEventListener('click', () => {
  activateTab('stats')
  activateStatsSubTab('summary')
})
tabListBtn.addEventListener('click', () => activateTab('list'))

statsSubSummaryBtn.addEventListener('click', () => activateStatsSubTab('summary'))
statsSubChartsBtn.addEventListener('click', () => activateStatsSubTab('charts'))
statsSubDetailsBtn.addEventListener('click', () => activateStatsSubTab('details'))

applyStatsFiltersBtn.addEventListener('click', applyStatsFilters)
resetStatsFiltersBtn.addEventListener('click', resetStatsFilters)

exportStatsFilteredBtn.addEventListener('click', () => {
  const exportEntries = getFilteredStatsEntries()
  if (!exportEntries.length) {
    setStatus(statsExportStatus, 'Keine gefilterten Statistik-Daten für den Export vorhanden.', 'error')
    return
  }

  setStatus(statsExportStatus, `Export der gefilterten Statistik gestartet (${getActiveStatsFilterLabel()}).`, 'success', { autoClear: true })
  exportStatisticsCsv(exportEntries, {
    filename: `shooting-book-statistik-gefiltert-${new Date().toISOString().slice(0, 10)}.csv`,
    filterLabel: getActiveStatsFilterLabel(),
  })
})

exportStatsAllBtn.addEventListener('click', () => {
  if (!allEntriesCache.length) {
    setStatus(statsExportStatus, 'Keine Daten für die Gesamtstatistik vorhanden.', 'error')
    return
  }

  setStatus(statsExportStatus, 'Export der Gesamtstatistik gestartet.', 'success', { autoClear: true })
  exportStatisticsCsv(allEntriesCache, {
    filename: `shooting-book-gesamtstatistik-${new Date().toISOString().slice(0, 10)}.csv`,
    filterLabel: 'Alle Daten',
  })
})

toggleDisciplinePanelBtn.addEventListener('click', () => {
  clearStatus(disciplineStatus)
  if (disciplinePanel.style.display === 'block') closeDisciplinePanel()
  else openDisciplinePanel()
})

toggleWeaponPanelBtn.addEventListener('click', () => {
  clearStatus(weaponStatus)
  if (weaponPanel.style.display === 'block') closeWeaponPanel()
  else openWeaponPanel()
})


toggleStatsFilterPanelBtn.addEventListener('click', () => {
  if (statsFilterPanel.style.display === 'block') closeStatsFilterPanel()
  else openStatsFilterPanel()
})

toggleListFilterPanelBtn.addEventListener('click', () => {
  if (listFilterPanel.style.display === 'block') closeListFilterPanel()
  else openListFilterPanel()
})



cancelEditBtn.addEventListener('click', async () => {
  const returnTab = editingEntryId && editingOriginTab === 'list' ? 'list' : 'entry'
  resetForm()
  await loadFormData()
  activateTab(returnTab)
})

applyFiltersBtn.addEventListener('click', applyEntryFiltersAndReload)
resetFiltersBtn.addEventListener('click', resetFilters)

;[filterType, filterYear, filterMonth, filterDiscipline, filterWeapon].forEach((element) => {
  element.addEventListener('change', () => {
    clearStatus(listExportStatus)
  })
})

;[statsFilterYear, statsFilterMonth, statsFilterType, statsFilterDiscipline, statsFilterWeapon].forEach((element) => {
  element.addEventListener('change', () => {
    clearStatus(statsExportStatus)
  })
})

deleteDisciplineBtn.addEventListener('click', async () => {
  await deleteDisciplineById(deleteDisciplineSelect.value)
})

deleteWeaponBtn.addEventListener('click', async () => {
  await deleteWeaponById(deleteWeaponSelect.value)
})

exportListFilteredBtn.addEventListener('click', () => {
  const exportEntries = getFilteredEntries()
  if (!exportEntries.length) {
    setStatus(listExportStatus, 'Keine gefilterten Einträge für den Export vorhanden.', 'error')
    return
  }

  setStatus(listExportStatus, `Export der gefilterten Einträge gestartet (${getActiveListFilterLabel()}).`, 'success', { autoClear: true })
  exportEntriesXlsx(exportEntries, `shooting-book-meine-eintraege-gefiltert-${new Date().toISOString().slice(0, 10)}.xlsx`)
})

exportListAllBtn.addEventListener('click', () => {
  if (!allEntriesCache.length) {
    setStatus(listExportStatus, 'Keine Einträge für den Export vorhanden.', 'error')
    return
  }

  setStatus(listExportStatus, 'Export aller Einträge gestartet.', 'success', { autoClear: true })
  exportEntriesXlsx(allEntriesCache, `shooting-book-meine-eintraege-alle-${new Date().toISOString().slice(0, 10)}.xlsx`)
})

addDisciplineBtn.addEventListener('click', async () => {
  setStatus(disciplineStatus, 'Disziplin wird angelegt...', 'info')
  const user = await getCurrentUser()
  if (!user) {
    setStatus(disciplineStatus, 'Nicht eingeloggt.', 'error')
    return
  }

  const name = newDisciplineName.value.trim()
  if (!name) {
    setStatus(disciplineStatus, 'Bitte einen Disziplin-Namen eingeben.', 'error')
    return
  }

  const { data: existingDiscipline, error: duplicateError } = await findExistingDiscipline(user.id, name)
  if (duplicateError) {
    setStatus(disciplineStatus, `Fehler bei der Dublettenprüfung: ${duplicateError.message}`, 'error')
    return
  }

  if (existingDiscipline) {
    setStatus(disciplineStatus, `Disziplin bereits vorhanden: ${existingDiscipline.name}`, 'info', { autoClear: true })
    newDisciplineName.value = ''
    closeDisciplinePanel()
    return
  }

  const { data, error } = await supabase.from('disciplines').insert([{ user_id: user.id, name }]).select('id, name').single()
  if (error) {
    setStatus(disciplineStatus, `Fehler: ${error.message}`, 'error')
    return
  }

  setStatus(disciplineStatus, 'Disziplin gespeichert.', 'success', { autoClear: true })
  newDisciplineName.value = ''
  await loadDisciplines()


  closeDisciplinePanel()
})

addWeaponBtn.addEventListener('click', async () => {
  setStatus(weaponStatus, 'Waffe wird angelegt...', 'info')
  const user = await getCurrentUser()
  if (!user) {
    setStatus(weaponStatus, 'Nicht eingeloggt.', 'error')
    return
  }

  const name = newWeaponName.value.trim()
  const type = newWeaponType.value.trim()
  const caliber = newWeaponCaliber.value.trim()
  const notes = newWeaponNotes.value.trim()

  if (!name) {
    setStatus(weaponStatus, 'Bitte einen Waffen-Namen eingeben.', 'error')
    return
  }

  const { data, error } = await supabase
    .from('weapons')
    .insert([{
      user_id: user.id,
      name,
      type: type || null,
      caliber: caliber || null,
      notes: notes || null,
    }])
    .select('id, name')
    .single()

  if (error) {
    setStatus(weaponStatus, `Fehler: ${error.message}`, 'error')
    return
  }

  setStatus(weaponStatus, 'Waffe gespeichert.', 'success', { autoClear: true })
  newWeaponName.value = ''
  newWeaponType.value = ''
  newWeaponCaliber.value = ''
  newWeaponNotes.value = ''

  await loadWeapons()


  closeWeaponPanel()
})

entryType.addEventListener('change', () => {
  updateTrainingDurationVisibility()

  if (entryType.value === 'competition') {
    const currentBlocks = getBlockDataFromForm({ allowIncomplete: true })
    const firstBlock = { ...(currentBlocks[0] || getEmptyBlockData()), is_collapsed: false }
    renderEntryBlocks([firstBlock])
  } else {
    renderEntryBlocks(getBlockDataFromForm({ allowIncomplete: true }))
  }
})

addBlockBtn.addEventListener('click', () => {
  const currentBlocks = getBlockDataFromForm({ allowIncomplete: true })
  const previousBlock = currentBlocks[currentBlocks.length - 1] || null
  currentBlocks.forEach((block) => {
    block.is_collapsed = true
  })
  currentBlocks.push(getNextBlockDefaults(previousBlock))
  renderEntryBlocks(currentBlocks, { focusLastBlock: true })
})

expandAllBlocksBtn.addEventListener('click', () => {
  const currentBlocks = getBlockDataFromForm({ allowIncomplete: true })
  currentBlocks.forEach((block) => {
    block.is_collapsed = false
  })
  renderEntryBlocks(currentBlocks)
})

collapseAllBlocksBtn.addEventListener('click', () => {
  const currentBlocks = getBlockDataFromForm({ allowIncomplete: true })
  currentBlocks.forEach((block) => {
    block.is_collapsed = true
  })
  renderEntryBlocks(currentBlocks)
})

useLocationBtn.addEventListener('click', async () => {
  if (!navigator.geolocation) {
    setStatus(entryStatus, 'Standort wird von diesem Browser nicht unterstützt.', 'error')
    return
  }

  setStatus(entryStatus, 'Standort wird ermittelt...', 'info')
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
      if (!response.ok) throw new Error('Kein lesbarer Ort gefunden.')
      const data = await response.json()
      const address = data.address || {}
      const readable = [
        address.road,
        address.village || address.town || address.city || address.municipality,
      ].filter(Boolean).join(', ')
      entryLocation.value = readable || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      setStatus(entryStatus, 'Standort übernommen.', 'success', { autoClear: true })
    } catch (error) {
      entryLocation.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      setStatus(entryStatus, 'Standort als Koordinaten übernommen.', 'success', { autoClear: true })
    }
  }, (error) => {
    setStatus(entryStatus, `Standort konnte nicht übernommen werden: ${error.message}`, 'error')
  }, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  })
})

saveEntryBtn.addEventListener('click', async () => {
  const wasEditing = Boolean(editingEntryId)
  setStatus(entryStatus, wasEditing ? 'Speichere Änderungen...' : 'Speichere Eintrag...', 'info')
  const user = await getCurrentUser()

  if (!user) {
    setStatus(entryStatus, 'Nicht eingeloggt.', 'error')
    return
  }
  if (!entryDate.value) {
    setStatus(entryStatus, 'Bitte ein Datum wählen.', 'error')
    return
  }

  if (entryType.value === 'training') {
    const duration = Number(trainingDurationMinutesInput.value)
    if (!Number.isInteger(duration) || duration < 1) {
      setStatus(entryStatus, 'Bitte gültige Trainingsdauer in Minuten eingeben.', 'error')
      return
    }
  }

  let blocks
  try {
    blocks = getBlockDataFromForm()
  } catch (error) {
    setStatus(entryStatus, error.message, 'error')
    return
  }

  if (!blocks.length) {
    setStatus(entryStatus, 'Bitte mindestens einen Block erfassen.', 'error')
    return
  }

  const entryPayload = {
    user_id: user.id,
    entry_date: entryDate.value,
    entry_type: entryType.value || null,
    location: entryLocation.value.trim() || null,
    note: entryNote.value.trim() || null,
    training_duration_minutes: entryType.value === 'training'
      ? Number(trainingDurationMinutesInput.value)
      : null,
  }

  const preserveBlocks = blocks.map((block) => ({
    discipline_id: block.discipline_id || '',
    weapon_id: block.weapon_id || '',
    shots_per_series: block.shots_per_series || '',
    note: block.note || '',
    series_count: Math.max(block.series.length, block.series_count || 1),
    series_scores: Array.from({ length: Math.max(block.series.length, block.series_count || 1) }, (_, idx) => block.series[idx]?.score ?? ''),
  }))

  let currentEntryId = editingEntryId

  if (!editingEntryId) {
    const { data: entryData, error: entryError } = await supabase
      .from('entries')
      .insert([entryPayload])
      .select('id')
      .single()

    if (entryError) {
      setStatus(entryStatus, `Fehler: ${entryError.message}`, 'error')
      return
    }

    currentEntryId = entryData.id
  } else {
    const { error: updateError } = await supabase
      .from('entries')
      .update({
        entry_date: entryPayload.entry_date,
        entry_type: entryPayload.entry_type,
        location: entryPayload.location,
        note: entryPayload.note,
        training_duration_minutes: entryPayload.training_duration_minutes,
      })
      .eq('id', editingEntryId)
      .eq('user_id', user.id)

    if (updateError) {
      setStatus(entryStatus, `Fehler beim Aktualisieren: ${updateError.message}`, 'error')
      return
    }

    const { data: existingBlocks, error: existingBlocksError } = await supabase
      .from('entry_blocks')
      .select('id')
      .eq('entry_id', editingEntryId)
      .eq('user_id', user.id)

    if (existingBlocksError) {
      setStatus(entryStatus, `Fehler beim Laden bestehender Blöcke: ${existingBlocksError.message}`, 'error')
      return
    }

    const existingBlockIds = (existingBlocks || []).map((block) => block.id)
    if (existingBlockIds.length) {
      const { error: deleteSeriesError } = await supabase
        .from('entry_series')
        .delete()
        .eq('user_id', user.id)
        .in('entry_block_id', existingBlockIds)

      if (deleteSeriesError) {
        setStatus(entryStatus, `Fehler beim Löschen bestehender Serien: ${deleteSeriesError.message}`, 'error')
        return
      }
    }

    const { error: deleteBlocksError } = await supabase
      .from('entry_blocks')
      .delete()
      .eq('entry_id', editingEntryId)
      .eq('user_id', user.id)

    if (deleteBlocksError) {
      setStatus(entryStatus, `Fehler beim Aktualisieren der Blöcke: ${deleteBlocksError.message}`, 'error')
      return
    }
  }

  const blockRows = blocks.map((block, index) => ({
    user_id: user.id,
    entry_id: currentEntryId,
    block_order: index + 1,
    discipline_id: block.discipline_id || null,
    weapon_id: block.weapon_id || null,
    shots_per_series: block.shots_per_series,
    note: block.note || null,
    total_score: block.total_score,
  }))

  const { data: insertedBlocks, error: blockError } = await supabase
    .from('entry_blocks')
    .insert(blockRows)
    .select('id, block_order')

  if (blockError) {
    setStatus(entryStatus, `Fehler bei Blöcken: ${blockError.message}`, 'error')
    return
  }

  const blockIdByOrder = new Map((insertedBlocks || []).map((block) => [Number(block.block_order), block.id]))
  const seriesRows = []

  blocks.forEach((block, index) => {
    const blockId = blockIdByOrder.get(index + 1)
    ;(block.series || []).forEach((series) => {
      seriesRows.push({
        entry_id: currentEntryId,
        entry_block_id: blockId,
        user_id: user.id,
        series_number: series.series_number,
        score: series.score,
      })
    })
  })

  if (seriesRows.length > 0) {
    const { error: seriesError } = await supabase.from('entry_series').insert(seriesRows)
    if (seriesError) {
      setStatus(entryStatus, `Fehler bei Serien: ${seriesError.message}`, 'error')
      return
    }
  }

  const returnTab = wasEditing && editingOriginTab === 'list' ? 'list' : 'entry'

  if (!wasEditing) {
    setStatus(entryStatus, 'Eintrag gespeichert.', 'success', { autoClear: true })
    resetForm()
  } else {
    setStatus(entryStatus, 'Eintrag aktualisiert.', 'success', { autoClear: true })
    resetForm()
  }

  await loadFormData()
  await loadEntries()
  activateTab(returnTab)
})


async function init() {
  document.title = 'Shooting Book'
  resetForm()
  closeDisciplinePanel()
  closeWeaponPanel()
  closeStatsFilterPanel()
  closeListFilterPanel()
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
