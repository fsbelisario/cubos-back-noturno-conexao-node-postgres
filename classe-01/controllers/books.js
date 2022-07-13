const conection = require('../conection');

const listBooks = async (req, res) => {
    try {
        const query = `
            SELECT books.id, authors.name as author, books.title,
            books.genre, books.publisher, books.publication_date
            FROM books
            LEFT JOIN authors ON books.author_id = authors.id
        `;
        const { rows: books } = await conection.query(query);
        return res.status(200).json(books);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getBook = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM livros WHERE id = $1';
        const book = await conection.query(query, [id]);

        if (book.rowCount === 0) {
            return res.status(404).json('Livro não encontrado.');
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const enrollBook = async (req, res) => {
    const { author_id, title, genre, publisher, publication_date } = req.body;

    try {
        const query = `INSERT INTO books (author_id, title, genre, publisher, publication_date) 
        VALUES ($1, $2, $3, $4, $5)`;
        const enrolledBook = await conection.query(query, [author_id, title, genre, publisher, publication_date]);

        if (enrolledBook.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastar o livro.');
        }

        return res.status(200).json('Livro cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const updateBook = async (req, res) => {
    const { id } = req.params;
    const { author_id, title, genre, publisher, publication_date } = req.body;

    try {
        let query = 'SELECT * FROM books WHERE id = $1';
        const book = await conection.query(query, [id]);

        if (book.rowCount === 0) {
            return res.status(404).json('Livro não encontrado.');
        }

        query = `UPDATE books SET 
        author_id = $1,
        title = $2,
        genre = $3,
        publisher = $4,
        publication_date = $5
        WHERE id = $6`;

        const updatedBook = await conection.query(query, [author_id, title, genre, publisher, publication_date, id]);

        if (updatedBook.rowCount === 0) {
            return res.status(400).json('Não foi possível atualizar o livro.');
        }

        return res.status(200).json('O livro foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const removeBook = async (req, res) => {
    const { id } = req.params;

    try {
        let query = 'SELECT * FROM books WHERE id = $1';
        const book = await conection.query(query, [id]);

        if (book.rowCount === 0) {
            return res.status(404).json('Livro não encontrado.');
        }

        query = 'SELECT * FROM loans WHERE book_id = $1';
        const bookLoans = await conection.query(query, [id]);
        if (bookLoans.rowCount !== 0) {
            return res.status(404).json('Livro possui empréstimo(s) associado(s) e não pode ser removido.');
        }

        query = 'DETELE FROM books WHERE id = $1';
        const removedBook = await conection.query(query, [id]);

        if (removedBook.rowCount === 0) {
            return res.status(400).json('Não foi possível excluir o livro.')
        }

        return res.status(200).json('O livro foi excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listBooks,
    getBook,
    enrollBook,
    updateBook,
    removeBook
}