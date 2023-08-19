import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getUserByLogin } from '../Querries/users.mjs'

const login = async (req, res, next) => {
    try {
        const user = await getUserByLogin(req.body.login)
        if (!user) {
            return res.status(401).json({ message: 'Connexion non autorisée.' })
        }
        
        const isValid = bcrypt.compareSync(req.body.password, user.password)
        if (!isValid) {
            return res.status(401).json({ message: 'Connexion non autorisée.' })
        }

        res.status(200).json({
            userId: user.id,
            associationId: user.association_id,
            userLvl: user.is_admin,
            token: jwt.sign(
                { userId: user.id, associationId: user.association_id, userLvl: user.is_admin },
                'G_ASSO_RANDOM_FJDSKFJHSDKFJDHSBF',
                { expiresIn: '24h' }
            )
        })

        next()
    } 
    catch (error) {
        res.status(500).json({ error: "Une erreur est survenue." });
    }
}

export default login
