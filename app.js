import express from 'express'
import auth from './Middleware/auth.js'

import login from './Routes/login.js'

import associations from './Routes/associations.js'
import groups from './Routes/groups.js'
import members from './Routes/members.js'
import searchs from './Routes/searchs.js'
import users from './Routes/users.js'

const app = express()
app.use(express.json())

// pour gérer les erreurs CORS
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
    next(); 
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