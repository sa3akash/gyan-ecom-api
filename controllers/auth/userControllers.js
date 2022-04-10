import user from "../../models/user";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const userControllers = {
  async me(req, res, next) {
    try {
      const users = await user.findOne({ _id: req.users._id }).select("-password -updatedAt -__v");
      if (!users) {
        return next(CustomErrorHandler.notFound());
      }
      res.json(users);
    } catch (err) {
      return next(err);
    }
  },
};

export default userControllers;
