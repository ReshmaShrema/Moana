const createError = require('http-errors');
const express = require('express');
const path = require('path');

//view engine setup npm i express-handlebars
const hbs=require('express-handlebars')

//parse the incomming cookie
const cookieParser = require('cookie-parser');

//session management
const session=require('express-session');
const logger = require('morgan');

//for setting environment variable
require('dotenv').config()

//database importing
const db =require('./config/connection');

//router setting
//const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter =require('./routes/admin');

//setting the server up,init express app
const app = express();

//uploading file
const fileUploads=require('express-fileupload');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//setting partial and layout folder
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials'}))

app.use(logger('dev'));

//parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//cookieParser midsleware
app.use(cookieParser());

//static file managing
app.use(express.static(path.join(__dirname, 'public')));

//setting fileUploads
app.use(fileUploads());

//creating session ,place before app.use(route)
const oneDay = 1000 * 60 * 60 * 24
app.use(session({
  secret:'key',//sectet key
  saveUninitialized:true,
  cookie:{maxAge:oneDay},
  resave:false
}))



//setting router
//app.use('/index', indexRouter);
app.use('/user', usersRouter);
app.use('/admin',adminRouter);

//database connection 

db.connect((err)=>{
  if(err) console.log(err)
  else  
  console.log("Database connected")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;