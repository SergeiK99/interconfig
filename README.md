# InterConfig - Система конфигурации вентиляционного оборудования

## Описание проекта
Система для подбора и конфигурации вентиляционного оборудования компании Tion. Позволяет пользователям просматривать каталог устройств, подбирать оборудование под свои нужды и оформлять заказы.

## Требования
- Node.js (версия 18 или выше)
- .NET 8.0 SDK
- PostgreSQL 15 или выше
- Docker (опционально, для запуска базы данных)

## Установка и запуск

### Frontend
1. Перейдите в директорию frontend:
   ```bash
   cd frontend
   ```

2. Установите зависимости:
   ```bash
   npm install
   npm install axios
   ```

3. Создайте файл `.env` в корне frontend директории и настройте базовый URL:
   ```
   REACT_APP_API_BASE_URL = 'https://localhost:7134/api'
   ```

4. Запустите приложение:
   ```bash
   npm start
   ```

### Backend
1. Перейдите в директорию backend:
   ```bash
   cd backend
   ```

2. Проверьте и при необходимости обновите строку подключения к базе данных в `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5433;Database=InterConfigDb;Username=postgres;Password=123"
   }
   ```

3. Запустите базу данных:
   - Если используете Docker:
     ```bash
     docker-compose up -d
     ```
   - Или установите PostgreSQL локально

4. Примените миграции:
   ```bash
   dotnet ef database update
   ```

5. Запустите приложение:
   ```bash
   dotnet run
   ```

## Основные функции
- Просмотр каталога вентиляционного оборудования
- Фильтрация устройств по параметрам
- Подбор оборудования под конкретные требования
- Корзина покупок
- Оформление заказов
- Административная панель для управления каталогом

## Структура проекта
- `/frontend` - React приложение
- `/backend` - ASP.NET Core API
- `/BackendDataAccess` - Слой доступа к данным
- `/BackendModels` - Модели данных

## Технологии
- Frontend: React, Axios, Material-UI
- Backend: ASP.NET Core, Entity Framework Core
- База данных: PostgreSQL
- Аутентификация: JWT

## Разработка
Для внесения изменений в проект:
1. Создайте новую ветку
2. Внесите изменения
3. Создайте pull request
