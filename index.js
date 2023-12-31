import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { config as configDotenv } from "dotenv"; // Changed import
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controller/auth.js";
import { createPost } from "./controller/posts.js";
import { verifyToken } from "./middleware/auth.js";

// Configuring
const require = createRequire(import.meta.url); // Added line
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
configDotenv();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FileStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//Route with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Mongoose config
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error, Didn't connect to MongoDB:", err);
  });
