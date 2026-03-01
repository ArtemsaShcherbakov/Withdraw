## Withdraw Application

Тестовое задание для Frontend Developer (React + Next.js)

## 📋 О проекте

Приложение для вывода средств (Withdraw) с устойчивым UI, безопасной архитектурой и полным покрытием тестами. Реализована страница создания заявки на вывод с валидацией, интеграцией с API, защитой от двойного сабмита и отображением статуса созданной заявки.

## 🎯 Реализованные требования

Core (обязательно)
✅ Страница Withdraw с полями amount, destination и confirm checkbox

✅ Валидация формы (amount > 0, destination не пустой)

✅ Submit доступен только при валидной форме

✅ Submit disabled во время запроса

✅ API интеграция (POST /v1/withdrawals)

✅ Idempotency key для защиты от дублирования

✅ Понятное сообщение об ошибке 409 (Conflict)

✅ Retry при сетевых ошибках с сохранением данных

✅ Отображение созданной заявки и её статуса после успеха

✅ Защита от двойного submit

✅ Тесты (happy path, ошибка API, защита от двойного submit)

Дополнительно
✅ Восстановление последней заявки после перезагрузки (5 минут)

✅ Мемоизация компонентов для оптимизации производительности

✅ Гибкая система idempotency с UUID v4

✅ Кастомные UI-компоненты (Input, Checkbox, Button)

✅ Полная типизация TypeScript

## Getting Started

First, run the development server:

# Клонирование репозитория

```bash
git clone <repository-url>
cd withdraw-app
```

# Установка зависимостей

```bash
pnpm install
```

# Настройка переменных окружения

прописать env

# Запуск тестов

```bash
pnpm test
```

# Запуск в режиме разработки

```bash
pnpm dev
```

Откройте http://localhost:3000/withdraw в браузере, чтобы увидеть результат.

## Рекомендации для продакшена

Токены: Хранить в httpOnly cookies

CSRF: Добавить CSRF токены для всех изменяющих запросов

Rate Limiting: Настроить ограничение запросов

Content Security Policy: Настроить CSP заголовки

Валидация: Всегда валидировать на сервере

Idempotency: Обязательно использовать на критичных операциях

## 🔄 API Интеграция

# POST /v1/withdrawals

```bash
// Запрос
{
  "amount": number,
  "destination": string,
  "idempotency_key": string
}
```

```bash
// Запрос
{
  "id": string,
  "status": string,
  "amount": number,
  "destination": string,
}
```
