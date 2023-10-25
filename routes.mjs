// routes.js
import express from 'express';
import cors from 'cors';
import auth from './Middleware/auth.mjs';
import multer from 'multer';
import login from './Routes/login.mjs';
import associations from './Routes/associations.mjs';
import groups from './Routes/groups.mjs';
import members from './Routes/members.mjs';
import searchs from './Routes/searchs.mjs';
import users from './Routes/users.mjs';
import payments from './Routes/payments.mjs';
import userPayments from './Routes/userPayments.mjs';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'https://g-asso.com', //l'origine de votre site Web ici
    methods: 'GET,POST,PUT,DELETE', // Les méthodes HTTP autorisées
    allowedHeaders: 'Content-Type,Authorization', // Les en-têtes autorisés
  };
  
  // Utiliser le middleware CORS
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
    { name: 'certificate', maxCount: 1},
    { name: 'rib', maxCount: 1}
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

  app.get("/api/version", async (req, res) => {
      const password = "Karine2200";
      const hashedPassword = await bcrypt.hash(password, 10);
      res.json({
         version: "1.8.3",
    })
 });

app.post("/api/v1/login", login);
app.use('/api/v1/associations', auth, associations);
app.use("/api/v1/groups", auth, groups);
app.use("/api/v1/members", auth, members);
app.use("/api/v1/searchs", auth, searchs);
app.use("/api/v1/users", auth, users);
app.use("/api/v1/paiement", auth, payments);
app.use("/api/v1/userpayment", auth, userPayments);

export default app;
