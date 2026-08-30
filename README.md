# Task Tracker

Task Tracker — веб-приложение для управления личными проектами и задачами.

## Стек технологий

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- JWT-аутентификация

### Frontend

- React
- TypeScript
- Vite
- React Router

## Структура проекта

```text
task tracker/
├── backend/
│   ├── config/
│   ├── tasks/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   └── tt-front/
│       ├── src/
│       └── package.json
└── README.md
```

## Текущий прогресс

### Backend

- [x] Django-проект и PostgreSQL
- [x] Встроенная модель пользователя Django
- [x] Модели Project и Task
- [x] Django REST Framework
- [x] JWT-вход и обновление токена
- [x] Logout с отзывом refresh-токена
- [x] Защита API JWT-аутентификацией
- [x] CRUD API проектов
- [x] CRUD API задач
- [x] API регистрации

### Frontend

- [x] React, TypeScript, Vite и React Router
- [x] Страница входа
- [x] Сохранение JWT-токенов после входа
- [x] Logout
- [x] Страница проектов
- [x] Получение, создание и редактирование проектов
- [x] Корректное удаление проектов с JWT-токеном
- [x] Страница регистрации
- [x] Базовое состояние аутентификации
- [x] Защищённые маршруты
- [x] Интерфейс управления задачами

## API

Текущие маршруты:

```text
POST    /api/auth/login/
POST    /api/auth/refresh/
POST    /api/auth/logout/

GET     /api/projects/
POST    /api/projects/
GET     /api/projects/<id>/
PUT     /api/projects/<id>/
PATCH   /api/projects/<id>/
DELETE  /api/projects/<id>/

GET     /api/tasks/
POST    /api/tasks/
GET     /api/tasks/<id>/
PUT     /api/tasks/<id>/
PATCH   /api/tasks/<id>/
DELETE  /api/tasks/<id>/
```

Запланированные маршруты:

```text
POST    /api/auth/register/
```

## План разработки

### 1. Аутентификация

1. Регистрация пользователя

### 2. Проекты

1. Улучшить обработку ошибок и UX

### 3. Задачи

1. Поиск, фильтрация и сортировка задач

### 4. UX и развёртывание

1. Поиск, фильтрация и сортировка задач
2. Dashboard и адаптивный интерфейс
3. Переменные окружения для API URL
4. Production-настройки и развёртывание

## Правила проекта

- Пользователь видит и изменяет только собственные проекты.
- Задачи принадлежат проектам.
- Аутентификация и авторизация выполняются на backend.
- Пароли и секреты не хранятся во frontend-коде.
- API URL и чувствительные настройки должны задаваться через переменные окружения.

## Локальный запуск

### Через Docker

1. Скопируйте `backend/.env.example` в `backend/.env` и задайте безопасные значения `DB_PASSWORD` и `SECRET_KEY`.
2. В корне проекта выполните:

   ```bash
   docker compose up --build
   ```

3. Приложение будет доступно по адресам:

   - frontend: `http://localhost:5173`
   - backend API: `http://localhost:8000/api/`

### Без Docker

1. В backend создайте `backend/.env` на основе `backend/.env.example` и настройте PostgreSQL.
2. Установите backend-зависимости и примените миграции:

   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. В отдельном терминале настройте frontend и запустите Vite:

   ```bash
   cd frontend/tt-front
   cp .env.example .env
   npm ci
   npm run dev
   ```
