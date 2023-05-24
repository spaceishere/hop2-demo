class MyError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode || 404;
  }
}

module.exports = MyError;
