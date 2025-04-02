import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";
const IPOInfo = sequelize.define("IPOInfo", {
    id: {
        type: DataTypes.UUID,  // Use UUID instead of BIGINT
        defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,  // Foreign key reference to User table
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    company_logo_path: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price_band: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    open: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    close: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issue_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issue_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listing_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
    },
    ipo_price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listing_price: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    listing_gain: {
      type: DataTypes.STRING,
   
    },
 
    cmp: {
      type: DataTypes.STRING,
      allowNull: true, // Current Market Price
    },
    current_return: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rhp: {
      type: DataTypes.STRING,
      allowNull: true, // Red Herring Prospectus (Document Link)
    },
    drhp: {
      type: DataTypes.STRING,
      allowNull: true, // Draft RHP Document Link
    },
  }, {
    tableName: "ipo_info",
    timestamps: true, // Adds createdAt and updatedAt
  });
  export default IPOInfo;