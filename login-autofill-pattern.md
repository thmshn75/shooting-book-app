# Login Autofill Pattern — Browser-kompatibler Login für Vanilla JS Apps

Dieses Muster sorgt dafür, dass Chrome, Safari und iOS-Passwortmanager gespeicherte Zugangsdaten korrekt erkennen und anbieten — statt primär ein neues Passwort vorzuschlagen.

Getestet in: Vanilla JS + Supabase Auth. Funktioniert analog mit Firebase Auth, eigenen Backends etc.

---

## Das Problem

Browser erkennen Login-Formulare anhand von HTML-Semantik. Wenn Login und Registrierung im gleichen Block stehen, kein `<form>` vorhanden ist und `autocomplete`-Attribute fehlen, behandelt der Browser die Maske als Registrierung — und schlägt ein neues Passwort vor statt das gespeicherte anzubieten.

Typische Fehler:

```html
<!-- FALSCH: kein form, keine autocomplete-Attribute, gemischte Buttons -->
<h2>Login / Registrierung</h2>
<input id="email" type="email" placeholder="E-Mail" />
<input id="password" type="password" placeholder="Passwort" />
<button id="register-btn">Registrieren</button>
<button id="login-btn">Login</button>
```

---

## Die Lösung

### 1. Login als natives Formular

```html
<div id="auth-box">
  <h2>Login</h2>

  <form id="login-form" autocomplete="on">
    <label for="login-email" class="sr-only">E-Mail</label>
    <input
      id="login-email"
      name="username"
      type="email"
      placeholder="E-Mail"
      autocomplete="username"
      inputmode="email"
      required
    />

    <label for="login-password" class="sr-only">Passwort</label>
    <input
      id="login-password"
      name="password"
      type="password"
      placeholder="Passwort"
      autocomplete="current-password"
      required
    />

    <button id="login-btn" type="submit">Login</button>
  </form>

  <div class="auth-secondary-actions">
    <button id="show-register-btn" type="button" class="link-btn">Neues Konto erstellen</button>
    <button id="forgot-password-btn" type="button" class="link-btn">Passwort vergessen?</button>
  </div>

  <p id="auth-status"></p>
</div>
```

**Warum `name="username"` statt `name="email"`?**
Der Wert `username` ist der von der WHATWG-Spec vorgesehene Wert für Login-E-Mail-Felder. Browser und Passwortmanager erkennen ihn zuverlässiger als `email`.

**Warum `autocomplete="current-password"`?**
Signalisiert dem Browser: hier geht es um ein bestehendes Passwort. `new-password` würde das Gegenteil auslösen.

---

### 2. Registrierung als getrennter View

```html
<div id="register-box" style="display:none;">
  <h2>Registrierung</h2>

  <form id="register-form" autocomplete="on">
    <label for="register-email" class="sr-only">E-Mail</label>
    <input
      id="register-email"
      name="username"
      type="email"
      placeholder="E-Mail"
      autocomplete="username"
      inputmode="email"
      required
    />

    <label for="register-password" class="sr-only">Passwort</label>
    <input
      id="register-password"
      name="new-password"
      type="password"
      placeholder="Passwort"
      autocomplete="new-password"
      required
    />

    <button id="register-btn" type="submit">Registrieren</button>
  </form>

  <button id="show-login-btn" type="button" class="link-btn">Zurück zum Login</button>
  <p id="register-status"></p>
</div>
```

Hier ist `autocomplete="new-password"` korrekt — der Browser soll ein neues Passwort vorschlagen dürfen.

---

### 3. Event-Handler: `submit` statt `click`

```js
// DOM-Referenzen
const loginForm = document.getElementById('login-form')
const loginEmailInput = document.getElementById('login-email')
const loginPasswordInput = document.getElementById('login-password')
const authStatus = document.getElementById('auth-status')

const registerForm = document.getElementById('register-form')
const registerEmailInput = document.getElementById('register-email')
const registerPasswordInput = document.getElementById('register-password')
const registerStatus = document.getElementById('register-status')

const authBox = document.getElementById('auth-box')
const registerBox = document.getElementById('register-box')
const showRegisterBtn = document.getElementById('show-register-btn')
const showLoginBtn = document.getElementById('show-login-btn')
const forgotPasswordBtn = document.getElementById('forgot-password-btn')

// Login
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmailInput.value,
    password: loginPasswordInput.value,
  })

  if (error) {
    // Fehler anzeigen
    return
  }

  // Eingeloggt — UI umschalten, Daten laden
})

// Registrierung
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const { error } = await supabase.auth.signUp({
    email: registerEmailInput.value,
    password: registerPasswordInput.value,
  })

  if (error) {
    // Fehler anzeigen
    return
  }

  // Erfolg anzeigen
})

// Passwort vergessen (liest aus dem Login-Formular)
forgotPasswordBtn.addEventListener('click', async () => {
  const email = loginEmailInput.value.trim()
  if (!email) return

  await supabase.auth.resetPasswordForEmail(email)
})

// View-Toggle
showRegisterBtn.addEventListener('click', () => {
  authBox.style.display = 'none'
  registerBox.style.display = 'block'
})

showLoginBtn.addEventListener('click', () => {
  registerBox.style.display = 'none'
  authBox.style.display = 'block'
})
```

**Warum `submit` statt `click`?**
- Enter-Taste funktioniert automatisch
- Browser speichert Zugangsdaten nach erfolgreichem Submit (nicht nach Click)
- Native Formularvalidierung (`required`) greift

---

### 4. Beim Logout: Register-View zurücksetzen

```js
function showLoggedOutUI() {
  authBox.style.display = 'block'
  registerBox.style.display = 'none'
  // ... restlicher Logout-Code
}
```

---

## Checkliste für neue Projekte

- [ ] Login steht in einem eigenen `<form autocomplete="on">`
- [ ] E-Mail-Feld: `name="username"`, `autocomplete="username"`, `type="email"`
- [ ] Passwort-Feld (Login): `name="password"`, `autocomplete="current-password"`
- [ ] Passwort-Feld (Registrierung): `name="new-password"`, `autocomplete="new-password"`
- [ ] Login-Button: `type="submit"`
- [ ] Registrierung: eigenes `<form>` oder eigene Seite, nicht im selben Block
- [ ] Event-Listener auf `form submit`, nicht auf Button click
- [ ] `event.preventDefault()` im Submit-Handler
- [ ] Logout-Handler setzt Register-View zurück auf `display:none`

---

## Was dieses Muster nicht garantiert

Browser und iOS-Passwortmanager haben das letzte Wort. Das Muster entfernt die semantischen Störquellen — ob Autofill tatsächlich erscheint, hängt zusätzlich davon ab:

- ob der User Zugangsdaten für diese Domain gespeichert hat
- ob die App als PWA (standalone) oder im Browser läuft
- ob der Browser in einem privaten/Inkognito-Fenster läuft
- ob iOS-Einstellungen Passwort-Autofill erlauben
