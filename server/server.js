import express from "express"
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/User/user.js"
import { sequelize } from "./config/db.js";
import cors from "cors";
const app=express();
import IPORoute from "./routes/IPO_info/IPO_info.js";
// console.log("hii");
connectDB();
app.use(express.json());
app.use(cors());
app.use("/api/auth",authRoute);
app.use("/api/ipo",IPORoute);
app.use("/uploads", express.static("uploads")); 
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