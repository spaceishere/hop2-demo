const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.send({ error: "token alga" }).status(500);
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, user) => {
      const rolesArray = [...allowedRoles];

      const result = req.roles
        .map((role) => rolesArray.includes(role))
        .find((val) => val === true);

      if (!result) return res.sendStatus(401);

      if (error) {
        return res.send({ error: error }).status(500);
      }

      next();
    });
  } catch (error) {}
};
