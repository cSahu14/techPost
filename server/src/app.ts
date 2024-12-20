import express from "express";
import userRouter from "./user/userRoutes";
// import globalErrorHandlers from "./middlewares/globalErrorHandler";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// const allowedOrigins = [config?.frontendDomain, config?.frontendDomainAdmin];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );
app.use(express.json())
console.log("sdfsdfsdf")
app.get("/", (req, res) => {
    res.send("Hi there")
})

app.use("/v1/users", userRouter)

app.use(globalErrorHandler as (
    err: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => void)

export default app;