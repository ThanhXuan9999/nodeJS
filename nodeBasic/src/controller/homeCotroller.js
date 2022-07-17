import pool from '../configs/connectDB';
import multer from 'multer'

let getHomePage = async (req, res) => {

    let data = []

    const [row, fields] = await pool.execute('SELECT * FROM `users`')

    return res.render('../views/index.ejs', { dataUser: row })

}

const getDetailPage = async (req, res) => {
    let userId = req.params.id
    let [user] = await pool.execute(`SELECT * FROM users WHERE  id = ?`, [userId])

    return res.send(JSON.stringify(user))
}

const createNewUser = async (req, res) => {
    // Destructring {a, b, c, ....} = 1, 2, 3, ...
    let { lastName, firstName, email, address } = req.body

    await pool.execute('insert into users(lastName, firstName, email, address) values (?, ?, ?, ?)',
        [lastName, firstName, email, address])

    // Trở về trang chủ .redirect()
    return res.redirect('/')
}

let deleteUser = async (req, res) => {
    let userId = req.body.userId

    await pool.execute('delete from users where id = ?', [userId])

    return res.redirect('/')
}

let getEditPage = async (req, res) => {
    let id = req.params.id

    let [user] = await pool.execute('select * from users where id = ?', [id])

    return res.render('update.ejs', { dataUser: user[0] })
}

let postUpdateUser = async (req, res) => {
    let { lastName, firstName, email, address, id } = req.body

    await pool.execute('update users set firstName=?, lastName=?, email=?, address=? where id=?',
        [firstName, lastName, email, address, id])

    return res.redirect('/')

}

let getUploadFilePage = (req, res) => {
    return res.render('../views/uploadFile.ejs')
}


let handleUploadFile = async (req, res) => {

    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.send('Please select an image to upload');
    }

    // Display uploaded image for user validation
    // res.send(`You have uploaded this image: <hr/><img src="/image/${req.file.filename}" width="500"><hr /><a href="/upload-file">Upload another image</a>`);
    res.send(`You have uploaded this image: <hr/><img src="/image/${req.file.filename}" width="200"><hr /><a href="/upload-file">Upload another image</a>`);
}


let handleUpLoadMultipleFiles = (req, res) => {
    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.files) {
        return res.send('Please select an image to upload');
    }

    let result = "You have uploaded these images: <hr />";
    const files = req.files;
    let index, len;

    // Loop through all the uploaded images and display them on frontend
    for (index = 0, len = files.length; index < len; ++index) {
        result += `<img src="/image/${files[index].filename}" width="300" style="margin-right: 20px;">`;
    }
    result += '<hr/><a href="/upload-file">Upload more images</a>';
    res.send(result);
}

module.exports = {
    getHomePage, getDetailPage, createNewUser, deleteUser,
    getEditPage, postUpdateUser, getUploadFilePage, handleUploadFile,
    handleUpLoadMultipleFiles
}



