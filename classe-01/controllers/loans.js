const conection = require('../conection');

const listLoans = async (req, res) => {
    try {
        const query = `
            SELECT loans.id, users.name as user, users.email as email,
            users.phone as phone, books.title as book, loans.status
            FROM loans
            LEFT JOIN users ON loans.user_id = users.id
            LEFT JOIN books ON loans.book_id = books.id
        `;
        const { rows: loans } = await conection.query(query);

        return res.status(200).json(loans);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getLoan = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT loans.id, users.name as user, users.email as email,
            users.phone as phone, books.title as book, loans.status
            FROM loans
            LEFT JOIN users ON loans.user_id = users.id
            LEFT JOIN books ON loans.book_id = books.id
            WHERE loans.id = $1
        `;
        const loan = await conection.query(query, [id]);

        if (loan.rowCount === 0) {
            return res.status(404).json('Empréstimo não encontrado.');
        }

        return res.status(200).json(loan.rows[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const enrollLoan = async (req, res) => {
    const { user_id, book_id } = req.body;

    if (!user_id) {
        return res.status(400).json("O campo ID do usuário é obrigatório.");
    }

    if (!book_id) {
        return res.status(400).json("O campo ID do livro é obrigatório.");
    }

    try {
        let query = 'SELECT * FROM users WHERE id = $1';
        const user = await conection.query(query, [user_id]);

        if (user.rowCount === 0) {
            return res.status(404).json('Usuário não encontrado.');
        }

        query = 'SELECT * FROM books WHERE id = $1';
        const book = await conection.query(query, [book_id]);

        if (book.rowCount === 0) {
            return res.status(404).json('Livro não encontrado.');
        }

        query = 'INSERT INTO loans (user_id, book_id) VALUES ($1, $2)';
        const loan = await conection.query(query, [user_id, book_id]);

        if (loan.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o empréstimo.');
        }

        return res.status(200).json('Empréstimo cadastrado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const updateLoan = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        let query = 'SELECT * FROM loans WHERE id = $1';
        const loan = await conection.query(query, [id]);

        if (loan.rowCount === 0) {
            return res.status(404).json('Empréstimo não encontrado.');
        }

        if (!status) {
            return res.status(400).json("O campo status é obrigatório.");
        }

        query = 'UPDATE loans SET status = $1 WHERE id = $2';
        const updatedLoan = await conection.query(query, [status, id]);

        if (updatedLoan.rowCount === 0) {
            return res.status(404).json('Não foi possível atualizar o empréstimo.');
        }

        return res.status(200).json('Empréstimo foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const removeLoan = async (req, res) => {
    const { id } = req.params;

    try {
        let query = 'SELECT * FROM loans WHERE id = $1';
        const loan = await conection.query(query, [id]);

        if (loan.rowCount === 0) {
            return res.status(404).json('Empréstimo não encontrado.');
        }

        query = 'DELETE FROM loans WHERE id = $1';
        const removedLoan = await conection.query(query, [id]);

        if (removedLoan.rowCount === 0) {
            return res.status(404).json('Não foi possível excluir o empréstimo.');
        }

        return res.status(200).json('Empréstimo foi excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listLoans,
    getLoan,
    enrollLoan,
    updateLoan,
    removeLoan
}