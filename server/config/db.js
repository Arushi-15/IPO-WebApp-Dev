import Sequelize from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',   // The database type (PostgreSQL in this case)
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false } // Required for PostgreSQL (Neon) in production
    },
    logging: false, // Disable SQL logging (optional)
  });
  
  const connectDB = async () => {
    try {
      // Try to authenticate and connect to the database
      await sequelize.authenticate();
      console.log(' Connected to PostgreSQL using Sequelize');
    } catch (error) {
      console.error(' Unable to connect to the database:', error);
      process.exit(1); // Exit the process if the connection fails
    }
  };
  
 export  {sequelize , connectDB};