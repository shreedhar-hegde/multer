const express = require('express');
const multer = require('multer');
const ejs = require('ejs');

const path = require('path');

//storage engine

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname+ '-' + Date.now() + path.extname(file.originalname))
    }
})

//upload init

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
}).single('myImage')


//checking file type
function checkFileType(file, cb) {
    const fileTypes = /jpeg|png|gif|jpg/

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())

    const mimetype = fileTypes.test(file.mimetype)

    if(mimetype && extname) {
        return cb(null, true) 
    } else {
        cb('Error: images only')
    }
}

//app initialisation
const app = express();

//ejs
app.set('view engine','ejs')

app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'))

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err) {res.render('index', {
            msg: err
        })} else {
            if(req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No file selected'
                })
            } else {
                res.render('index', {
                    msg: 'uploaded',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const port = 3000;

app.listen(port, () => console.log(`server started on port ${port}`))