import express from 'express';
import configViewengine from './configs/viewEngine.js';
import initWebRouter from './route/web';
import initAPIRoute from './route/api'
// import connection from './configs/connectDB';

require('dotenv').config()

const app = express()
const port = process.env.port || 3000  // dấu '||' là dự phòng "cái này or cái kia"
const path = require('path')

// lấy dữ liệu được gửi lên server
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// setup view engine
configViewengine(app)

// init web route
initWebRouter(app)

// init api route
initAPIRoute(app)

app.use((req, res) => {
    return res.render('404notFound.ejs')
})

app.listen(port, () => {
    console.log(`Example app listening http://localhost:${port}`)
})