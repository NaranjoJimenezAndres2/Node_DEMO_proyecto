const jwt = require('jsonwebtoken');

//declarar un funcion y exportarla

export const verifyToken = (req : any, res : any, next :any) => {
    const token = req.header('authorization')
    console.log(token)
    if (!token) return res.status(401).send('Access denied. No token provided.');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
}


