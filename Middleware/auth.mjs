const auth = (req, res, next) => {
    // Allow all requests without authentication check during development
    if (process.env.NODE_ENV === 'development') {
        next();
    } else {
        // For other environments, perform authentication as usual
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.CRYPT);

            const userId = decodedToken.userId;
            const associationId = decodedToken.associationId;
            const userLvl = decodedToken.userLvl;

            req.auth = { userId, associationId, userLvl };
            next();
        } catch (error) {
            res.status(401).json({ error: "Unauthorized" });
        }
    }
}

export default auth;