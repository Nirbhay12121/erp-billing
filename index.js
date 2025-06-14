require("dotenv").config();
const express = require("express");
const configureMiddleware = require("./middleware/middleware"); // Import the middleware configuration
const connectToDatabase = require("./db/db.js"); // Import the database configuration
const cors = require("cors"); // Import cors
const sql = require("mssql"); // Import sql from mssql
const authenticateToken = require("./middleware/authenticateToken.js");

const usersRegisterRoutes = require("./routes/usersRegisterRoutes.js");
const terms_condsRoutes = require("./routes/terms_condsRoutes.js");
const transportersRoutes = require('./routes/transporters.js');
const categoryRoutes = require("./routes/categoryRoutes.js");
const beatRoutes = require("./routes/beatRoutes.js");

// Initialize the Express app
const app = express();
const port = 5000;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

// Initialize routes
app.use("/api", usersRegisterRoutes);
app.use("/api", terms_condsRoutes);
app.use('/api', transportersRoutes);
app.use("/api", categoryRoutes);
app.use("/api", beatRoutes);

// Use the middleware configuration
configureMiddleware(app);

// Connect to the database
connectToDatabase()
  .then((pool) => {
    console.log("Connected to SQL Server");

    // Change POST to GET
    app.get("/api/users", async (req, res) => {
      try {
        const result = await sql.query(`
      SELECT TOP (1000) [UserID], [Username], [Email], [PasswordHash], [CreatedAt]
      FROM [aman].[aman].[UsersRegister]
    `);

        res.json(result.recordset);
      } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    // Handle database connection error
    console.error("Failed to connect to the database:", err);
  });
