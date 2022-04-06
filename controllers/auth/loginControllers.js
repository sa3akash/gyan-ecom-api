import Joi from "joi";
import { User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import bcrytp from "bcrypt";
import JwtToken from "../../services/JwtToken";

const loginControllers = {
  async login(req, res, next) {
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
      res.json({ Token: accessToken });
      
    } catch (err) {
      return next(err);
    }
  },
};

export default loginControllers;
