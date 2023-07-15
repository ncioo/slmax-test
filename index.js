const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const session = require('express-session');
const SessionStore = require('connect-mongo');
const { Server } = require('socket.io');
const loadRoutes = require('./api/routes');
const loadEvents = require('./api/events');
const { serverPort } = require('./config');

//	Подключаемся к базе
const dbReady = require('./db');

//	Создаем express приложение
const app = express();

//	Создаем HTTP сервер
const httpServer = http.createServer(app);

//	Создаем socket.io сервер
const io = new Server(httpServer);

//	Создаем обработчик сессий с уже существующим подключением к базе данных
const sessionMiddleware = session({
	secret: 'fh5l86-Fg6s-dtFs-L093',
	store: SessionStore.create({
		clientPromise: dbReady.then(() => mongoose.connection.getClient()),
		stringify: false
	}),
	resave: false,
	saveUninitialized: false
});

//	Настраиваем ejs и ejs-mate как движок для рендера страниц
app.engine('ejs', require('ejs-mate'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//	Добавляем обработчик сессий
app.use(sessionMiddleware);

//	Парсим запросы в JSON
app.use(express.json());

//	Добавляем обработку файлов из папки /public/... по адресу /static/...
app.use('/static', express.static(__dirname + '/public'));

//	Настраиваем аутентификацию passport.js'а
const User = mongoose.model('User');
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//	Добавляем обработчик сессий на сервер socket.io
io.use((socket, next) => {
	sessionMiddleware(socket.request, socket.request.res, next);
});

//	Загружаем маршруты express'а из ./api/routes
loadRoutes(app);

//	Загружаем события socket.io из ./api/events
loadEvents(io);

//	Запускаем сервер
httpServer.listen({ port: serverPort }, console.log('Ready'));
