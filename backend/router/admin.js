const express = require("express");

const { createAdmin, login, checkAdmin } = require("../controller/admin");

const router = express.Router();

router.get("/getAdmin", checkAdmin);

router.post("/", createAdmin);
router.post("/login", login);

module.exports = router;
