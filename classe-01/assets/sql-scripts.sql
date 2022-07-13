CREATE DATABASE biblioteca;

DROP TABLE IF EXISTS authors;
CREATE TABLE authors (
	id serial PRIMARY KEY,
	name varchar NOT NULL,
  	age smallint
);

DROP TABLE IF EXISTS books;
CREATE TABLE books (
	id serial PRIMARY KEY,
	author_id int NOT NULL REFERENCES authors(id),
  	title varchar(100) NOT NULL,
  	publisher varchar(100),
  	genre varchar(50) NOT NULL,
  	publication_date date  
);

INSERT INTO authors
(name, age)
VALUES
('Frank Herbert', 65),
('Isaac Asimov', 72),
('George Orwell', 46)

INSERT INTO books
(author_id, title, publisher, genre, publication_date)
VALUES
(1,'Duna','Aleph','Ficção Científica','2017-04-28'),
(2,'Fundação','Aleph','Ficção Científica','2009-05-15'),
(3,'1984','Companhia das Letras','Ficção Científica','2009-07-21')

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id serial PRIMARY KEY,
	name varchar NOT NULL,
  	age smallint,
  	email varchar(100) NOT NULL UNIQUE,
  	phone varchar(11),
  	tax_id char(11) NOT NULL UNIQUE
);

INSERT INTO users
(name, age, email, phone, tax_id)
VALUES
('Felipe', 36, 'fbelisario@gmail.com','31988840087','11111111111'),
('João', 27, 'joao@email.com','31900000000','22222222222'),
('Maria', 31,'maria@email.com','32900000000','33333333333')

DROP TABLE IF EXISTS loans;
CREATE TABLE loans (
	id serial PRIMARY KEY,
	user_id int NOT NULL REFERENCES users(id),
  	book_id int NOT NULL REFERENCES books(id),
  	status varchar(9) NOT NULL DEFAULT 'pendente'
);

INSERT INTO loans
(user_id, book_id, status)
VALUES
(1, 1, 'devolvido'),
(2, 1, 'devolvido'),
(1, 2, 'pendente'),
(3, 3, 'pendente')