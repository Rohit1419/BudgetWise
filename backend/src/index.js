import dotenv from "dotenv";
import dbConnect from "./db/db.js";
import app from "./app.js";

dotenv.config({
  path: ".env",
});

dbConnect()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
    });

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is listining on port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
