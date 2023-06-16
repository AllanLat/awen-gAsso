import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'G_ASSO_RANDOM_FJDSKFJHSDKFJDHSBF');

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