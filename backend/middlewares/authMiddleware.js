import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;


    // Ensure Authorization header follows "Bearer <token>" format to avoid processing malformed or invalid tokens

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access Denied! Token missing or malformed.",
        });
    }

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied! No token provided."
        });
    }

    //decode token
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }
    catch(e){
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

export default authMiddleware;