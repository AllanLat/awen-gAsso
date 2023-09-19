import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
    try {

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.CRYPT);


        const userId = decodedToken.userId;
        const associationId = decodedToken.associationId;
        const userLvl = decodedToken.userLvl;

        req.auth = { userId, associationId, userLvl };
        next();

    } catch (error) {
        res.status(401).json({ error:"Unauthorized" }); 
     
    } 
}

export default auth