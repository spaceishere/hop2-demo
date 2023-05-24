const express = require("express");
const cors = require("cors");
const colors = require("colors");
require("dotenv").config();

//router
const userRouter = require("./router/user");
const adminRouter = require("./router/admin");
const artistRouter = require("./router/artist");
const productRouter = require("./router/product");
const cartRouter = require("./router/cart");

//middleware
const errorHandler = require("./middleware/error");
const connectDB = require("./middleware/DB");

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());

let whitelist = ["http://localhost:3000", "http://localhost:3001", undefined];

let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credential: true,
};

app.use(cors(corsOptions));

app.use("/user", userRouter);
app.use("/artist", artistRouter);
app.use("/admin", adminRouter);
app.use("/cart", cartRouter);
app.use("/product", productRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, "listening on port");
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`aldaa garjee: ${err.message}`.red.underline);
  server.close(() => {
    process.exit(1);
  });
});
