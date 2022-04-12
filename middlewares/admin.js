import { User } from "../models"
import CustomErrorHandler from "../services/CustomErrorHandler"

const admin = async (req, res, next)=>{
    try{
        const user = await User.findOne({_id: req.users._id});// users auth meddleware anahoice
        if(user.role=== "admin"){
            next()
        } else {
            return next(CustomErrorHandler.unAuthorized());
        }
    } catch(err) {
        return next(CustomErrorHandler.multerServerError(err.message));
    }
}


export default admin;