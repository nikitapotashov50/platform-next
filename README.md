# BM Platform

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Новая версия БМ платформы

## Установка зависимостей

```bash
yarn
```

## Запуск

Создайте .env файл в корневой директории

```bash
HOST=localhost
PORT=3002
DB_URI=mysql://root:root@localhost:32774/test
API_VERSION=v1
```

```bash
npm start
```

## Структура

  - **/api** - API роуты, файл должен экспортить koa-router instance
  - **/components** - React-компоненты
  - **/config** - конфиги
  - **/controllers** - методы, используемые в API эндпоинтах
  - **/models** - sequelize-модели
  - **/pages** - компоненты-страницы, рендерятся на сервере

## Создание новой страницы

Необходимо создать React-компонент в папке `pages`

Например `pages/users.js` ▷ `https://example.com/users`

## Создание нового API эндпоинта

Необходимо создать файл в папке `api`

Например `api/users.js`, затем добавить его в функцию `combineRouters` в `api/index.js` ▷ `https://example.com/api/v1/users`

## Проверка

### Линтер

```bash
npm run lint
```

### Тесты

```bash
npm test
```

## License

MIT
