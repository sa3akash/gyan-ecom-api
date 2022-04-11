import Joi from "joi";
import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrytp from "bcrypt";
import JwtToken from "../../services/JwtToken";
import { JWT_REFRESH_SECRET } from "../../config";

const loginControllers = {
  async login(req, res, next) {
    // validatae start
    const loginSchemaValidator = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    // validator
    const { error } = loginSchemaValidator.validate(req.body);
    if (error) {
      return next(error);
    }
    // email and pasword database exist or not
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(
          CustomErrorHandler.loginError("Email & Password is Wrong!")
        );
      }
      //conpare email & password
      const match = await bcrytp.compare(req.body.password, user.password);
      if (!match) {
        return next(
          CustomErrorHandler.loginError("Email & Password is Wrong!")
        );
      }
      // token ganarate
      const accessToken = JwtToken.sign({ _id: user._id, role: user.role });
      const refreshToken = JwtToken.sign(
        { _id: user._id, role: user.role },
        "1y",
        JWT_REFRESH_SECRET
      );
      //save refresh token database
      await RefreshToken.create({ token: refreshToken });

      res.json({ Token: accessToken, refreshToken: refreshToken });
    } catch (err) {
      return next(err);
    }
  },

  // Logout method work

  async logout(req, res, next) {
    // validation

    const logoutSchemaValidator = Joi.object({
      token: Joi.string().required(),
    });
    // validator
    const { error } = logoutSchemaValidator.validate(req.body);
    if (error) {
      return next(error);
    }
    // delete token in database
    try {
      await RefreshToken.deleteOne({ Token: req.body.token });
    } catch (err) {
      return next(new Error("Somthing went wrong in the Database"));
    }
    res.json({ msg: "logout" });
  },
};

export default loginControllers;
