# Galeria Zdjęć - Kotony LaFamilia

Aplikacja galerii zdjęć zbudowana w Node.js + Express.js z frontendem w czystym JavaScript.

## Funkcjonalności

- ✅ Rejestracja i logowanie użytkowników
- ✅ Upload i zarządzanie zdjęciami
- ✅ Tworzenie i zarządzanie albumami
- ✅ System polubień i ocen zdjęć
- ✅ Komentarze do zdjęć
- ✅ Zdjęcia profilowe
- ✅ Ustawienia użytkownika (motyw, język)
- ✅ Responsywny design

## Wymagania

- Node.js (wersja 14 lub nowsza)
- MySQL (lub MariaDB)
- npm lub yarn

## Instalacja

1. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

2. **Skonfiguruj bazę danych:**
   - Utwórz bazę danych MySQL o nazwie `myapp`
   - Użytkownik: `root`
   - Hasło: (puste)
   - Host: `127.0.0.1`

3. **Uruchom serwer:**
   ```bash
   npm start
   ```
   
   Lub w trybie deweloperskim:
   ```bash
   npm run dev
   ```

4. **Otwórz aplikację:**
   - Przejdź do: `http://localhost:3000`

## Struktura projektu

```
Projekt_Galeria/
├── server.js              # Główny plik serwera
├── config.js              # Konfiguracja aplikacji
├── database.js            # Połączenie z bazą danych
├── middleware.js          # Middleware (auth, rate limiting)
├── routes/                # API endpoints
│   ├── auth.js           # Autoryzacja (login, register)
│   ├── photos.js         # Zarządzanie zdjęciami
│   ├── albums.js         # Zarządzanie albumami
│   ├── comments.js       # Komentarze
│   └── users.js          # Użytkownicy
├── uploads/              # Katalog na zdjęcia
├── main.html            # Główna strona galerii
├── login.html           # Strona logowania
├── signup.html          # Strona rejestracji
├── profile.html         # Profil użytkownika
├── users.html           # Lista użytkowników
├── main.js              # Frontend JavaScript
├── main.css             # Style CSS
└── package.json         # Zależności Node.js
```

## API Endpoints

### Autoryzacja
- `POST /api/auth/login` - Logowanie
- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/logout` - Wylogowanie
- `GET /api/auth/verify` - Weryfikacja tokenu

### Zdjęcia
- `GET /api/photos` - Lista zdjęć (z filtrami)
- `POST /api/photos/upload` - Upload zdjęcia
- `POST /api/photos/like` - Polubienie zdjęcia
- `POST /api/photos/rate` - Ocena zdjęcia
- `DELETE /api/photos/:id` - Usunięcie zdjęcia
- `POST /api/photos/profile` - Upload zdjęcia profilowego

### Albumy
- `GET /api/albums` - Lista albumów użytkownika
- `POST /api/albums` - Tworzenie albumu
- `GET /api/albums/:id/photos` - Zdjęcia w albumie
- `DELETE /api/albums/:id` - Usunięcie albumu

### Komentarze
- `GET /api/comments/:photoId` - Komentarze do zdjęcia
- `POST /api/comments` - Dodanie komentarza
- `DELETE /api/comments/:id` - Usunięcie komentarza

### Użytkownicy
- `GET /api/users` - Lista użytkowników
- `GET /api/users/profile` - Profil użytkownika
- `PUT /api/users/profile` - Aktualizacja profilu
- `PUT /api/users/password` - Zmiana hasła
- `GET /api/users/photos` - Zdjęcia użytkownika
- `GET /api/users/albums` - Albumy użytkownika

## Migracja z PHP

Aplikacja została w pełni zmigrowana z PHP na Node.js:

### Co zostało zmienione:
- **Backend:** PHP → Node.js + Express.js
- **Autoryzacja:** Sesje PHP → JWT tokens
- **Frontend:** PHP templates → HTML + JavaScript
- **Upload plików:** PHP `$_FILES` → Multer
- **Baza danych:** PDO → mysql2

### Zachowane funkcjonalności:
- Wszystkie funkcje z oryginalnej aplikacji PHP
- Identyczny interfejs użytkownika
- Te same style CSS
- Pełna kompatybilność z istniejącą bazą danych

## Bezpieczeństwo

- JWT tokens dla autoryzacji
- Rate limiting dla API
- Walidacja danych wejściowych
- CORS protection
- Helmet.js dla nagłówków bezpieczeństwa
- Hashowanie haseł z bcrypt

## Rozwój

Aby dodać nowe funkcjonalności:

1. Dodaj endpoint w odpowiednim pliku w `routes/`
2. Zaktualizuj frontend w `main.js`
3. Dodaj style w `main.css` jeśli potrzeba
4. Przetestuj funkcjonalność

## Wsparcie

W przypadku problemów sprawdź:
- Czy MySQL jest uruchomiony
- Czy port 3000 jest wolny
- Czy wszystkie zależności są zainstalowane
- Logi w konsoli serwera
