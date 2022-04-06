class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.stauts = status;
    this.message = msg;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }
  static loginError(message="Usarname & Password is Wrong!") {
    return new CustomErrorHandler(401, message);
  }
}

export default CustomErrorHandler;
