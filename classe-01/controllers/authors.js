const conection = require('../conection');

const listAuthors = async (req, res) => {
    try {
        let query = 'SELECT * FROM authors';
        const { rows: authors } = await conection.query(query);

        for (const author of authors) {
            query = `
                SELECT id, title, genre, publisher, publication_date
                FROM books
                WHERE author_id = $1
            `;

            const { rows: books } = await conection.query(query, [author.id]);
            author.books = books;
        }

        return res.status(200).json(authors);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getAuthor = async (req, res) => {
    const { id } = req.params;
    try {
        query = 'SELECT * FROM authors WHERE id = $1';
        const author = await conection.query(query, [id]);

        if (author.rowCount === 0) {
            return res.status(404).json('Autor não encontrado.');
        }

        query = `
            SELECT id, title, genre, publisher, publication_date
            FROM books
            WHERE author_id = $1
        `;
        const { rows: books } = await conection.query(query, [id]);
        author.rows[0].books = books;

        return res.status(200).json(author.rows[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const enrollAuthor = async (req, res) => {
    const { name, age } = req.body;

    if (!name) {
        return res.status(400).json("O campo nome é obrigatório.");
    }

    try {
        const query = 'INSERT INTO authors (name, age) VALUES ($1, $2)';
        const author = await conection.query(query, [name, age]);

        if (author.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o autor.');
        }

        return res.status(200).json('Autor cadastrado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const updateAuthor = async (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;

    try {
        let query = 'SELECT * FROM authors WHERE id = $1';
        const author = await conection.query(query, [id]);

        if (author.rowCount === 0) {
            return res.status(404).json('Autor não encontrado.');
        }

        if (!name) {
            return res.status(400).json("O campo nome é obrigatório.");
        }

        query = 'UPDATE authors SET name = $1, age = $2 WHERE id = $3';
        const updatedAuthor = await conection.query(query, [name, age, id]);

        if (updatedAuthor.rowCount === 0) {
            return res.status(404).json('Não foi possível atualizar o autor.');
        }

        return res.status(200).json('Autor foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const removeAuthor = async (req, res) => {
    const { id } = req.params;

    try {
        let query = 'SELECT * FROM authors WHERE id = $1';
        const author = await conection.query(query, [id]);

        if (author.rowCount === 0) {
            return res.status(404).json('Autor não encontrado.');
        }

        query = 'SELECT * FROM books WHERE author_id = $1';
        const booksFromAuthor = await conection.query(query, [id]);
        if (booksFromAuthor.rowCount !== 0) {
            return res.status(404).json('Autor possui livro(s) associado(s) e não pode ser removido.');
        }

        query = 'DELETE FROM authors WHERE id = $1';
        const removedAuthor = await conection.query(query, [id]);

        if (removedAuthor.rowCount === 0) {
            return res.status(404).json('Não foi possível excluir o autor.');
        }

        return res.status(200).json('Autor foi excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listAuthors,
    getAuthor,
    enrollAuthor,
    updateAuthor,
    removeAuthor
}