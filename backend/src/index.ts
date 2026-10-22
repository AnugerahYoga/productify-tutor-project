import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentroutes";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true })); // "credentials" => allows front end to send cookies to the backend so that we can authenticate the user
app.use(clerkMiddleware()); // akan memberikan properti auth pada req object
app.use(express.json()); // mengurai JSON req body
app.use(express.urlencoded({ extended: true })); // mengurai form data (seperti html form)

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Wellcome to productify API",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);

app.listen(ENV.PORT, () =>
  console.log(`server is running at http://localhost:${ENV.PORT}/`),
);
