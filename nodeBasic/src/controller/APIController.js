import pool from '../configs/connectDB';

let getAllUser = async (req, res) => {
    const [row, fields] = await pool.execute('SELECT * FROM `users`')

    return res.status(200).json({
        message: 'ok',
        data: row
    })
}

let createNewUser = async (req, res) => {
    // Destructring {a, b, c, ....} = 1, 2, 3, ...
    let { lastName, firstName, email, address } = req.body

    if (!lastName || !firstName || !email || !address) {
        return res.status(200).json({
            message: 'Not ok'
        })
    }
    await pool.execute('insert into users(lastName, firstName, email, address) values (?, ?, ?, ?)',
        [lastName, firstName, email, address])

    return res.status(200).json({
        message: 'ok'
    })
}

let updateUser = async (req, res) => {
    let { lastName, firstName, email, address, id } = req.body

    if (!lastName || !firstName || !email || !address || !id) {
        return res.status(200).json({
            message: 'Not ok'
        })
    }

    await pool.execute('update users set firstName=?, lastName=?, email=?, address=? where id=?',
        [firstName, lastName, email, address, id])

    return res.status(200).json({
        message: 'ok'
    })
}

let deleteUser = async (req, res) => {
    let userId = req.params.id

    if (!userId) {
        return res.status(200).json({
            message: 'Not ok'
        })
    }

    await pool.execute('delete from users where id = ?', [userId])

    return res.status(200).json({
        message: 'ok'
    })
}

module.exports = {
    getAllUser, createNewUser, updateUser, deleteUser
}