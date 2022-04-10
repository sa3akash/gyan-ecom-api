class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.stauts = status;
    this.message = msg;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }
  static loginError(message = "Usarname & Password is Wrong!") {
    return new CustomErrorHandler(401, message);
  }
  static unAuthorized(message = "unAuthorized!") {
    return new CustomErrorHandler(401, message);
  }
  static notFound(message = "404 Not Found") {
    return new CustomErrorHandler(400, message);
  }
}

export default CustomErrorHandler;
