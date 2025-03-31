// server.js
import express from "express";
import cors from "cors";
import orders from "./routes/orders.js";
import materials from "./routes/materials.js";
import shapes from "./routes/shapes.js";
import login from "./routes/login.js";
import signup from "./routes/signup.js";
import adminSignup from "./routes/adminSignup.js";
import profile from "./routes/profile.js";
import users from "./routes/users.js";
import shapeUploads from "./routes/shapeUploads.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
// Mount routes
app.use("/orders", orders);
app.use("/materials", materials);
app.use("/shapes", shapes);

app.use("/users/login", login);
app.use("/users/signup", signup);
app.use("/users", users);
app.use("/users/profile", profile);

app.use("/admin/signup", adminSignup);
app.use("/upload/shapes", shapeUploads)

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
