import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import checkJWT from "./supportFunctions/checkJWT.js";
import connectDb from "./supportFunctions/mongodb.js";
import {
  createUser,
  deleteUser,
  updateUser,
  userLogin,
} from "./dbRouteControllers/userController.js";
import {
  createAdmin,
  deleteAdmin,
  updateAdmin,
  adminLogin,
} from "./dbRouteControllers/adminController.js";
import {
  createQrData,
  getQrData,
  deleteQrData,
} from "./dbRouteControllers/qrDataController.js";

const app = express();

// Add JSON parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(
  cors()
  //   {
  //   origin: "http://localhost:3000", // Replace with your frontend URL
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  // }
);

// load environment variables.
dotenv.config();

// Connect to MongoDB
await connectDb();

app.get("/", (req, res) => {
  res.send("Welcome to the QRify backend API");
}); // Define routes
app.post("/api/userLogin", userLogin); // user login
app.post("/api/createUser", createUser); // create a new user
app.delete("/api/deleteUser", checkJWT, deleteUser); // delete a user
app.put("/api/updateUser", checkJWT, updateUser); // update user data
app.post("/api/adminLogin", adminLogin); // admin login
app.post("/api/createAdmin", createAdmin); // create a new admin
app.delete("/api/deleteAdmin", checkJWT, deleteAdmin); // delete an admin
app.put("/api/updateAdmin", checkJWT, updateAdmin); // update admin data
app.post("/api/createQrData", createQrData); // create a new QR code data
app.get("/api/getQrData", getQrData); // fetch all QR data for a user
app.delete("/api/deleteQrData", deleteQrData); // delete QR code data by id

app.listen(process.env.port || 4000, () => {
  console.log(
    `Server is running at http://localhost:${process.env.port || 4000}`
  );
});
