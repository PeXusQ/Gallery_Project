# Instrukcja uruchomienia - Galeria Zdjęć

## Krok 1: Instalacja Node.js

1. Pobierz Node.js z https://nodejs.org/
2. Zainstaluj wersję LTS (Long Term Support)
3. Sprawdź instalację:
   ```bash
   node --version
   npm --version
   ```

## Krok 2: Instalacja zależności

Otwórz terminal w folderze `Projekt_Galeria` i uruchom:

```bash
npm install
```

## Krok 3: Konfiguracja bazy danych

1. Uruchom XAMPP
2. Włącz Apache i MySQL
3. Otwórz phpMyAdmin (http://localhost/phpmyadmin)
4. Utwórz bazę danych o nazwie `myapp`
5. Upewnij się, że użytkownik `root` ma hasło puste

## Krok 4: Uruchomienie serwera

W terminalu w folderze `Projekt_Galeria` uruchom:

```bash
npm start
```

Powinieneś zobaczyć:
```
✅ Database connected successfully
📝 Creating database tables...
✅ Database tables created successfully
🚀 Server running on http://localhost:3000
📁 Upload directory: C:\xampp\htdocs\Projekt_Galeria\uploads
```

## Krok 5: Testowanie aplikacji

1. Otwórz przeglądarkę
2. Przejdź do: http://localhost:3000
3. Zarejestruj nowe konto
4. Zaloguj się
5. Przetestuj wszystkie funkcje

## Rozwiązywanie problemów

### Problem: "Database connection failed"
- Sprawdź czy MySQL jest uruchomiony w XAMPP
- Sprawdź czy baza danych `myapp` istnieje
- Sprawdź ustawienia w `config.js`

### Problem: "Port 3000 is already in use"
- Zmień port w `config.js` na inny (np. 3001)
- Lub zatrzymaj proces używający portu 3000

### Problem: "Cannot find module"
- Uruchom ponownie `npm install`
- Sprawdź czy wszystkie pliki są w odpowiednich folderach

### Problem: Błędy CORS
- Sprawdź czy serwer działa na porcie 3000
- Sprawdź ustawienia CORS w `server.js`

## Struktura po migracji

### Pliki PHP → HTML + JS:
- `main.php` → `main.html` + `main.js`
- `login.php` → `login.html`
- `signup.php` → `signup.html`
- `profile.php` → `profile.html`
- `users.php` → `users.html`
- `index.php` → `index.html`

### Nowe pliki Node.js:
- `server.js` - główny serwer
- `config.js` - konfiguracja
- `database.js` - połączenie z bazą
- `middleware.js` - middleware
- `routes/` - API endpoints
- `package.json` - zależności

### Zachowane pliki:
- `main.css` - style (bez zmian)
- `login.css`, `signup.css` - style (bez zmian)
- `uploads/` - katalog na zdjęcia
- Wszystkie pliki graficzne

## Funkcjonalności po migracji

✅ **Wszystkie funkcje działają identycznie jak w PHP:**
- Rejestracja i logowanie
- Upload zdjęć
- Tworzenie albumów
- Polubienia i oceny
- Komentarze
- Zdjęcia profilowe
- Ustawienia użytkownika
- Responsywny design

## Zalety migracji na Node.js

1. **Lepsze performance** - asynchroniczne operacje
2. **Nowoczesny stack** - JavaScript wszędzie
3. **Łatwiejsze API** - RESTful endpoints
4. **Lepsze bezpieczeństwo** - JWT tokens
5. **Łatwiejszy rozwój** - jeden język programowania
6. **Lepsze narzędzia** - npm ecosystem

## Następne kroki

Po uruchomieniu możesz:
1. Dodać nowe funkcjonalności
2. Zoptymalizować performance
3. Dodać testy automatyczne
4. Wdrożyć na serwer produkcyjny
5. Dodać CI/CD pipeline
