import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


const User = sequelize.define("User", {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
  staff_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Assuming default is not staff
  },
  otp: {
    type: DataTypes.STRING,
   allowNull:true
  },
  otpexpires: {
    type: DataTypes.DATE,
   allowNull:true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  tableName: "users", // Matches the existing table name
});

export default User;
