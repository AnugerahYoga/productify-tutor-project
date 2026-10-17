import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware); // akan memberikan properti auth pada req object
app.use(express.json()); // mengurai JSON req body
app.use(express.urlencoded({ extended: true })); // mengurai form data (seperti html form)

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wellcome to productify API",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.listen(ENV.PORT, () =>
  console.log(`server is running at http://localhost:${ENV.PORT}/`),
);
