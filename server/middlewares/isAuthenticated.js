import jwt from "jsonwebtoken"

const isAuthenticated = async (req,res,next) =>{
    const token = req.cookies.token;
    if(!token) return res.status(400).json({message:"user isnt authenticated"})
    const decode = await jwt.verify(token,process.env.SECRET_KEY)
    if(!decode) return res.status(400).json({message:"invalid token"})
        req.id = decode.userId;
    next();
}

export default isAuthenticated;