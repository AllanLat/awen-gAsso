import express from 'express'

import associations from './Routes/associations.js'


const app = express()
app.use(express.json())

// Routes //
app.use('/api/v1/associations', associations)




// Traitement d’erreurs. Code copié depuis https://expressjs.com/fr/guide/error-handling.html
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})