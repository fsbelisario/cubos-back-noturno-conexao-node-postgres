const conection = require('../conection');

const listUsers = async (req, res) => {
    try {
        let query = 'SELECT * FROM users';
        const { rows: users } = await conection.query(query);

        for (const user of users) {
            query = `
                SELECT loans.id, users.name as user, loans.book_id, books.title as book, loans.status
                FROM loans
                LEFT JOIN users ON loans.user_id = users.id
                LEFT JOIN books ON loans.book_id = books.id
                WHERE loans.user_id = $1
            `;
            const { rows: loans } = await conection.query(query, [user.id]);
            user.loans = loans;
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        let query = 'SELECT * FROM users WHERE id = $1';
        const user = await conection.query(query, [id]);

        if (user.rowCount === 0) {
            return res.status(404).json('Usuário não encontrado.');
        }

        query = `
            SELECT loans.id, users.name as user, loans.book_id, books.title as book, loans.status
            FROM loans
            LEFT JOIN users ON loans.user_id = users.id
            LEFT JOIN books ON loans.book_id = books.id
            WHERE loans.user_id = $1
        `;
        const { rows: loans } = await conection.query(query, [id]);
        user.rows[0].loans = loans;

        return res.status(200).json(user.rows[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const enrollUser = async (req, res) => {
    const { name, age, email, phone, tax_id } = req.body;

    if (!name) {
        return res.status(400).json("O campo nome é obrigatório.");
    }

    if (!email) {
        return res.status(400).json("O campo e-mail é obrigatório.");
    }

    if (phone.length > 11) {
        return res.status(400).json("O campo telefone deve ter no máximo 11 dígitos (2 para o DDD e 8 a 9 para o número).");
    }

    if (!tax_id) {
        return res.status(400).json("O campo CPF é obrigatório.");
    }

    if (tax_id.length !== 11) {
        return res.status(400).json("O campo CPF deve ter 11 caracteres.");
    }

    try {
        const query = 'INSERT INTO users (name, age, email, phone, tax_id) VALUES ($1, $2, $3, $4, $5)';
        const user = await conection.query(query, [name, age, email, phone, tax_id]);

        if (user.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário.');
        }

        return res.status(200).json('Usuário cadastrado com sucesso.')
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, age, email, phone, tax_id } = req.body;

    try {
        let query = 'SELECT * FROM users WHERE id = $1';
        const user = await conection.query(query, [id]);

        if (user.rowCount === 0) {
            return res.status(404).json('Usuário não encontrado.');
        }

        if (!name) {
            return res.status(400).json("O campo nome é obrigatório.");
        }

        if (!email) {
            return res.status(400).json("O campo e-mail é obrigatório.");
        }

        if (phone.length > 11) {
            return res.status(400).json("O campo telefone deve ter no máximo 11 dígitos (2 para o DDD e 8 a 9 para o número).");
        }

        if (!tax_id) {
            return res.status(400).json("O campo CPF é obrigatório.");
        }

        if (tax_id.length !== 11) {
            return res.status(400).json("O campo CPF deve ter 11 caracteres.");
        }

        query = 'UPDATE users SET name = $1, age = $2, email = $3, phone = $4, tax_id = $5 WHERE id = $6';
        const updatedUser = await conection.query(query, [name, age, email, phone, tax_id, id]);

        if (updatedUser.rowCount === 0) {
            return res.status(404).json('Não foi possível atualizar o usuário.');
        }

        return res.status(200).json('Usuário foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const removeUser = async (req, res) => {
    const { id } = req.params;

    try {
        let query = 'SELECT * FROM users WHERE id = $1';
        const user = await conection.query(query, [id]);

        if (user.rowCount === 0) {
            return res.status(404).json('Usuário não encontrado.');
        }

        query = 'SELECT * FROM loans WHERE user_id = $1';
        const userLoans = await conection.query(query, [id]);
        if (userLoans.rowCount !== 0) {
            return res.status(404).json('Usuário possui empréstimo(s) associado(s) e não pode ser removido.');
        }

        query = 'DELETE FROM users WHERE id = $1';
        const removedUser = await conection.query(query, [id]);

        if (removedUser.rowCount === 0) {
            return res.status(404).json('Não foi possível excluir o usuário.');
        }

        return res.status(200).json('Usuário foi excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listUsers,
    getUser,
    enrollUser,
    updateUser,
    removeUser
}