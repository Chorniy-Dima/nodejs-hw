import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  console.log(err.message);

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
    error: isProd ? "Something went wrong" : err.message,
  });
};
