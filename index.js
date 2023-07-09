const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const session = require('express-session');
const SessionStore = require('connect-mongo');
const { Server } = require('socket.io');
const loadRoutes = require('./api/routes');
const loadEvents = require('./api/events');

const dbReady = require('./db');
const { serverPort } = require('./config');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const sessionMiddleware = session({
	secret: 'fh5l86-Fg6s-dtFs-L093',
	store: SessionStore.create({
		clientPromise: dbReady.then(() => mongoose.connection.getClient()),
		stringify: false
	}),
	resave: false,
	saveUninitialized: false
});

app.engine('ejs', require('ejs-mate'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(sessionMiddleware);
app.use(express.json());
app.use('/static', express.static(__dirname + '/public'));

const User = mongoose.model('User');
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

io.use((socket, next) => {
	sessionMiddleware(socket.request, socket.request.res, next);
});

loadRoutes(app);
loadEvents(io);

httpServer.listen({ port: serverPort }, console.log('Ready'));
