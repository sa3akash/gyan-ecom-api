import Joi from "joi";
import { User, RefreshToken } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtToken from "../../services/JwtToken";
import { JWT_REFRESH_SECRET } from "../../config";

const registerController = {
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });
    // validate schema
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    // if database exit or not exit
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(CustomErrorHandler.alreadyExist("Email already exist!"));
      }
    } catch (err) {
      return next(err);
    }

    // hash password
    const { name, email, password } = req.body;
    const hashPasword = await bcrypt.hash(password, 10);
    //prepere modle
    const user = new User({
      name: name,
      email: email,
      password: hashPasword,
    });

    // save data to database
    let accessToken;
    let refreshToken;
    try {
      const result = await user.save();
      //token ganarete
      accessToken = JwtToken.sign({ _id: result._id, role: result.role });
      //ganarate refresh token to save database
      refreshToken = JwtToken.sign({ _id: result._id, role: result.role },"1y",JWT_REFRESH_SECRET);
      //save refresh token database
      await RefreshToken.create({ token: refreshToken });
    } catch (err) {
      return next(err);
    }

    res.json({ accessToken, refreshToken});
  },
};

export default registerController;
