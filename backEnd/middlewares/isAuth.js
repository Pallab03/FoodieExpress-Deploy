import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        // console.log(token)
        if (!token)
            return res.status(400).json({ message: "token isn't found .Please Log in or sign up again" })

        const decodeToken = jwt.decode(token, process.env.JWT_SECRET)

        if (!decodeToken)
            return res.status(400).json({ message: "Invalid User" })
        // console.log(decodeToken)
        req.userId = decodeToken.userId;

        next()

    } catch (error) {
        res.status(500).json({ message: "is Auth Error form middleware" })

    }
}

export default isAuth
