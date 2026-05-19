# Bella Luxe — Beauty Salon

React + PHP (XAMPP) + MySQL (phpMyAdmin)

## Брз старт (3 чекори)

### 1. База — phpMyAdmin

1. Стартувај **Apache** + **MySQL** во XAMPP
2. Отвори http://localhost/phpmyadmin
3. **Import** → избери `beauty-salon-api/setup_full.sql` → Go

Ова креира база `beauty_salon` со табели, демо податоци и admin корисник:

| Email | Лозинка |
|-------|---------|
| `admin@bellaluxe.local` | `password` |

(или регистрирај нов корисник и во `users` стави `role = 'admin'`)

### 2. Backend — XAMPP

Двојно кликни: **`kopiraj-api-vo-xampp.bat`**  
(или рачно копирај `beauty-salon-api` во `C:\xampp\htdocs\`)

Провери: http://localhost/beauty-salon-api/health.php  
Треба: `"ok": true`

### 3. Frontend — React

```bash
cd frontend
npm install
copy .env.example .env.local
npm start
```

Апликација: http://localhost:3000

---

## Улоги

| Улога | Пристап |
|-------|---------|
| **admin** | Клиенти, услуги, вработени, термини (целосно) |
| **employee** | Само термини: додавање + листа |

## Структура

```
bella-luxe/
├── frontend/           React app
├── beauty-salon-api/   PHP API
├── setup_full.sql      (во beauty-salon-api/)
└── kopiraj-api-vo-xampp.bat
```

## Чести проблеми

| Симптом | Решение |
|---------|---------|
| Црвена лента „Setup required“ | Импортирај `setup_full.sql` |
| Access denied | Одјава/најава; провери `role` во `users` |
| Cannot reach API | `kopiraj-api-vo-xampp.bat`, Apache ON |
| Нема клиенти за термин | Admin → Clients → додади клиент |
| CORS грешка | `.env.local`: `REACT_APP_API_URL=http://localhost/beauty-salon-api` |

## Функции

- Најава / регистрација (вработени)
- Администратор: клиенти (име, телефон, email, белешки, број посети, историја)
- Администратор: услуги и вработени (додавање/бришење)
- Термини поврзани со клиент од базата
- Вработен: само нов термин + преглед
