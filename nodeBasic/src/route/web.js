import express from 'express'
import homeCotroller from '../controller/homeCotroller'
import multer from 'multer'
import path from 'path'

var appRoot = require('app-root-path')
const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('approot: ', appRoot)
        cb(null, appRoot + '/src/public/image/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter })

let uploadMultipleFiles = multer({ storage: storage, fileFilter: imageFilter }).array('multiple_images', 3);

const initWebRouter = (app) => {
    router.get('/', homeCotroller.getHomePage)
    router.get('/detail/user/:id', homeCotroller.getDetailPage)
    router.post('/create-new-user', homeCotroller.createNewUser)

    router.post('/delete-user', homeCotroller.deleteUser)
    router.get('/edit-user/:id', homeCotroller.getEditPage)
    router.post('/update-user', homeCotroller.postUpdateUser)

    router.get('/upload-file', homeCotroller.getUploadFilePage)
    router.post('/upload-profile-pic', upload.single('profile_pic'), homeCotroller.handleUploadFile)
    router.post('/upload-multiple-images', (req, res, next) => {
        uploadMultipleFiles(req, res, (err) => {
            if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
                // handle multer file limit error here
                res.send('LIMIT_UNEXPECTED_FILE')
            } else if (err) {
                res.send(err)
            }

            else {
                // make sure to call next() if all was well
                next();
            }
        })
    }, homeCotroller.handleUpLoadMultipleFiles)


    return app.use('/', router)
}

export default initWebRouter;


