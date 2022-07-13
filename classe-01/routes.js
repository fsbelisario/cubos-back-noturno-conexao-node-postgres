const express = require('express');
const authors = require('./controllers/authors');
const books = require('./controllers/books');
const users = require('./controllers/users');
const loans = require('./controllers/loans');

const routes = express();

// Autores
routes.get('/autores', authors.listAuthors);
routes.get('/autores/:id', authors.getAuthor);
routes.post('/autores', authors.enrollAuthor);
routes.put('/autores/:id', authors.updateAuthor);
routes.delete('/autores/:id', authors.removeAuthor);

// Livros
routes.get('/livros', books.listBooks);
routes.get('/livros/:id', books.getBook);
routes.post('/livros', books.enrollBook);
routes.put('/livros/:id', books.updateBook);
routes.delete('/livros/:id', books.removeBook);

//Usuários
routes.get('/usuarios', users.listUsers);
routes.get('/usuarios/:id', users.getUser);
routes.post('/usuarios', users.enrollUser);
routes.put('/usuarios/:id', users.updateUser);
routes.delete('/usuarios/:id', users.removeUser);

//Empréstimos
routes.get('/emprestimos', loans.listLoans);
routes.get('/emprestimos/:id', loans.getLoan);
routes.post('/emprestimos', loans.enrollLoan);
routes.put('/emprestimos/:id', loans.updateLoan);
routes.delete('/emprestimos/:id', loans.removeLoan);

module.exports = routes;