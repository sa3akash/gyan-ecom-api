import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtToken from "../services/JwtToken";

const auth = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(CustomErrorHandler.unAuthorized());
  }
  const token = authHeader.split(" ")[1];
  try {
    const { _id, role } = JwtToken.verify(token);
    const users = {
      _id,
      role,
    };
    req.users = users;
    next();
  } catch (err) {
    return next(CustomErrorHandler.unAuthorized());
  }
};

export default auth;
