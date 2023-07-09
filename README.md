# slmax-laravel-testovoe-zadanie

Основной стэк:

-   ejs
-   express
-   socket.io
-   mongoose
-   passport

## Как все работает

За отрисовку страниц отвечает **ejs** и **ejs-mate** (`/views/`).

Аутентификация и базовые маршруты реализованы через **express** (`/api/routes/`).

Через **socket.io** реализованы (`/api/events/`) :

1. Загрузка данных пользователя из сессии и его отрисовка;
2. Взаимодействие с сообщениями (создание, удаление, отправка файла);
3. Взаимодействие с чатами (создание, удаление)

Для хранения и управления данными использованы **MongoDB** и **mongoose** с моделями `User`, `Chat`, `Message` (`/models/`).


Превью чата:
![image](https://github.com/ncioo/slmax-laravel-testovoe-zadanie/assets/60670380/3a52608b-3410-437c-9f31-7c5e8f48554a)
