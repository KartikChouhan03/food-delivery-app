import jwt from "jsonwebtoken"

const authMiddleware = async (req,res,next ) =>{
    const {token } = req.headers;
    if(!token){
        return res.json({succes:false,message:"Not Authorized Login Again"})
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
    } catch (error) {
        
    }

}

export default authMiddleware;

