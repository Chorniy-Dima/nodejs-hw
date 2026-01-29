import express from "express";
import cors from 'cors';
import "dotenv/config";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import noteRoutes from "./routes/notesRoutes.js";
import helmet from "helmet";
import { errors } from "celebrate";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json({
  limit: "300kb",
}));
app.use(cors());
app.use(helmet());
app.use(logger);

app.use(noteRoutes);

app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
