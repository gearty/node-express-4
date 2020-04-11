var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var data = require("./db");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.render('index', { books: data.books });
});

app.get('/book', (req, res) => {
  const book = data.books.find(b => b.id === parseInt(req.query.id));
  res.render('book', {book: book});
});

app.get('/createBook', (req, res) => {
  res.render('createBook');
});

app.get('/editBook', (req, res) => {
  const book = data.books.find(b => b.id === parseInt(req.query.id));
  res.render('editBook', {book: book});
});

app.post('/createBook', (req, res) => {
  data.books.push(
      {
        'id': (data.books[data.books.length - 1].id + 1),
        'picture': req.body.picture,
        'name': req.body.name,
        'author': req.body.author,
        'isAvailable': true
      }
  );
  res.render('bookActionsResult', {title: "Книга успешно создана"});
});

app.post('/editBook', (req, res) => {
  var index = data.books.findIndex(b => b.id === parseInt(req.body.id));
  var oldBook = data.books[index];
  data.books[index] = {
    'id': oldBook.id,
    'picture': req.body.picture,
    'name': req.body.name,
    'author': req.body.author,
    'isAvailable': oldBook.isAvailable
  };
  res.render('bookActionsResult', {title: "Книга успешно сохранена"});
});

app.post('/changeBookStatus', (req, res) => {
  data.books.forEach(function (b) {
    if (b.id === parseInt(req.body.id)){
      b.isAvailable = req.body.isAvailable === 'true';
    }
  });
  res.render('bookActionsResult', {title: req.body.isAvailable === 'true' ? "Книга успешно возвращена" : "Книга успешно выдана"});
});

app.post('/deleteBook', (req, res) => {
  var index = data.books.findIndex(b => b.id === parseInt(req.body.id));
  data.books.splice(index, 1);
  res.render('bookActionsResult', {title: "Книга успешно удалена"});
});

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
