# Petro Auto

Современный веб-сайт для автосервиса, построенный на Astro с использованием Tailwind CSS.

## 🚀 Технологии

- **Astro** - современный фреймворк для создания веб-сайтов
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Sass** - препроцессор CSS
- **GSAP** - библиотека для анимаций
- **Swiper** - слайдер
- **Fancybox** - модальные окна и галереи

## 📦 Установка

```bash
npm install
```

## 🛠️ Разработка

```bash
npm run dev
```

Сайт будет доступен по адресу: http://localhost:4321

## 🏗️ Сборка

```bash
npm run build
```

## 📖 Предварительный просмотр

```bash
npm run preview
```

## 🚀 Деплой на GitHub Pages

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

### Шаги для деплоя:

1. **Создайте репозиторий на GitHub**
   - Создайте новый репозиторий с именем `petro-auto`
   - Или используйте существующий репозиторий

2. **Загрузите код в репозиторий**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/petro-auto.git
   git push -u origin main
   ```

3. **Настройте GitHub Pages**
   - Перейдите в Settings → Pages
   - В разделе "Source" выберите "GitHub Actions"
   - Убедитесь, что workflow файл `.github/workflows/deploy.yml` присутствует в репозитории

4. **Автоматический деплой**
   - При каждом push в ветку `main` будет автоматически запускаться сборка и деплой
   - Сайт будет доступен по адресу: `https://YOUR_USERNAME.github.io/petro-auto/`

### Структура проекта

```
petro-auto/
├── src/
│   ├── pages/          # Страницы сайта
│   ├── shared/         # Общие ресурсы
│   ├── ui/             # UI компоненты
│   └── widgets/        # Виджеты
├── public/             # Статические файлы
└── .github/workflows/  # GitHub Actions
```

## 📝 Скрипты

- `npm run dev` - запуск сервера разработки
- `npm run build` - сборка проекта
- `npm run preview` - предварительный просмотр
- `npm run stylelint` - проверка стилей
- `npm run prettier` - форматирование кода

## 🔧 Конфигурация

Основные настройки находятся в файле `astro.config.mjs`:
- Настройка базового пути для GitHub Pages
- Интеграция с Tailwind CSS
- Оптимизация сборки

## 📄 Лицензия

MIT