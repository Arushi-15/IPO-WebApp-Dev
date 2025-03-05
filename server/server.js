import express from "express"
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/User/user.js"
import { sequelize } from "./config/db.js";
const app=express();
console.log("hii");
connectDB();
app.use(express.json());

app.use("/api/auth",authRoute);
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  sequelize.sync({ force: false }) // This will not drop existing tables
  .then(() => {
    console.log('Database synced!');
  })
  .catch((err) => {
    console.log('Error syncing database:', err);
  });


  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })