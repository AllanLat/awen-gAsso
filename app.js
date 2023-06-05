import express from 'express'
import { getAssociations, getAssociation, createAssociation } from './database.js'

const app = express()



app.get("/associations", async (req, res) => {
    const associations = await getAssociations();
    res.send(associations);
})

app.get ("/associations/:id", async (req, res) => {
    const association = await getAssociation(req.params.id);
    res.send(association);
})


// Traitement d’erreurs. Code copié depuis https://expressjs.com/fr/guide/error-handling.html
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})