# MVP Agency Landing Page

Лаконичный сайт медиапродюсирования и создания вирусного контента (MVP Agency).

## Стек технологий
- **React 19 + TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Motion (Framer Motion)**
- **Lucide Icons**
- **Express Backend (API заявок в Telegram @wargen_me)**

---

## 🚀 Деплой на GitHub

### 1. Деплой через GitHub Pages (статический сайт)

Для публикации на бесплатный **GitHub Pages**:

1. Инициализируйте Git репозиторий и создайте репозиторий на GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: MVP Agency production website"
   git branch -M main
   git remote add origin https://github.com/<ВАШ_GITHUB_ЛОГИН>/<ИМЯ_РЕПОЗИТОРИЯ>.git
   git push -u origin main
   ```

2. Сборка для GitHub Pages уже настроена в файле `.github/workflows/deploy.yml`! При каждом push в ветку `main` GitHub автоматически соберет проект и опубликует его.
   - В настройках репозитория: **Settings ➔ Pages ➔ Source ➔ GitHub Actions**.

---

### 2. Деплой на Vercel / Render / Railway / Ample

Если вы хотите запускать вместе с Express бэкендом (отправка заявок напрямую через сервер):

#### Vercel:
- Импортируйте репозиторий на [vercel.com](https://vercel.com).
- Build Command: `npm run build`
- Output Directory: `dist`
- Задайте переменные окружения `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` при необходимости.

#### Render / Railway / VPS:
- Build Command: `npm run build`
- Start Command: `npm run start`

---

## 🛠 Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Проверка типов
npm run lint

# Сборка проекта
npm run build
```

## 📞 Контакты
- Telegram: [@wargen_me](https://t.me/wargen_me)
