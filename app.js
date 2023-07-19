import express from 'express'
import cors from 'cors'
import auth from './Middleware/auth.js'
import bodyParser from 'body-parser'
import multer from 'multer'; // Import multer

import login from './Routes/login.js'

import associations from './Routes/associations.js'
import groups from './Routes/groups.js'
import members from './Routes/members.js'
import searchs from './Routes/searchs.js'
import users from './Routes/users.js'

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// pour gérer les erreurs CORS
app.use(cors());

// Set up multer to handle FormData
const upload = multer({
    // Specify the file fields and their limits
    // 'photo', 'file', and 'otherFile' should match the names of the file fields in FormData
    storage: multer.memoryStorage(), // You can use memory storage or configure disk storage as needed
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB file size limit for each file
    },
}).fields([
    { name: 'photo', maxCount: 1 },
    { name: 'image_rights_signature', maxCount: 1 },
]);

// Use multer middleware
app.use((req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Handle multer errors (e.g., file size exceeded)
            return res.status(400).json({ error: 'File upload error' });
        } else if (err) {
            // Handle other errors
            return res.status(500).json({ error: 'Something went wrong' });
        }
        next();
    });
});

// Routes //
app.post("/api/v1/login", login)
app.use('/api/v1/associations', auth, associations)
app.use("/api/v1/groups", auth, groups)
app.use("/api/v1/members", auth, members)
app.use("/api/v1/searchs", auth, searchs)
app.use("/api/v1/users", auth, users)

// Traitement d’erreurs. Code copié depuis https://expressjs.com/fr/guide/error-handling.html
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})