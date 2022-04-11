import Joi from "joi";
import { JWT_REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtToken from "../../services/JwtToken";


const refreshControler = {
  async refresh(req, res, next) {
    // validatae start
    const refreshSchemaValidator = Joi.object({
      token: Joi.string().required()
    });
    // validator
    const { error } = refreshSchemaValidator.validate(req.body);
    if (error) {
      return next(error);
    }
    // database chack
    let tokenResult;
    try{
        tokenResult = await RefreshToken.findOne({ token: req.body.token });
        if(!tokenResult){
            return next(CustomErrorHandler.unAuthorized("Invalid refresh token"))
        }
        // token varification
        let userId;
        try{
            const {_id} = await JwtToken.verify(tokenResult.token, JWT_REFRESH_SECRET)
            userId = _id
        }catch(err){
            return next(CustomErrorHandler.unAuthorized("Invalid refresh token"))
        }

        const UserChack = await User.findOne({_id: userId})
        if(!UserChack){
            return next(CustomErrorHandler.notFound("No user Found!"))
        }
        // ganarate token
        const accessToken = JwtToken.sign({ _id: UserChack._id, role: UserChack.role });
        const refreshToken = JwtToken.sign({ _id: UserChack._id, role: UserChack.role },"1y",JWT_REFRESH_SECRET);
      //save refresh token database
      await RefreshToken.create({ token: refreshToken });

      res.json({ acessToken: accessToken, refreshToken: refreshToken });

    }catch(err){
        return next(new Error("Somthing went wrong " + err.message))
    }
  },
};

export default refreshControler;
