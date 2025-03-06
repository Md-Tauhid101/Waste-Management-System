import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";
import cors from 'cors';
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Waste Management System",
    password: "Tauhid@2003",
    port: 5432,
});
db.connect();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// POST request for Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email exists
        const result = await db.query(
            "SELECT password FROM project WHERE LOWER(email) = $1", [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(404).send({ message: "Email not found" });
        }

        const hashedPassword = result.rows[0].password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            res.status(200).send({ message: "Login successful!" });
        } else {
            return res.status(401).send({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Database error' });
    }
});


// POST request for Sign Up
app.post("/SignUp", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }

    if (password.length < 8) {
        return res.status(400).send({ message: "Password must be at least 8 characters long" });
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).send({ error: 'Error processing password' });
    }

    try {
        // Check if the email already exists
        const result = await db.query(
            "SELECT COUNT(*) AS count FROM project WHERE LOWER(email) = $1", 
            [email.toLowerCase()]
        );

        if (result.rows.length > 0 && result.rows[0].count > 0) {
            return res.status(400).send({ message: "Email already exists" });
        }

        // Log the data before insertion
        console.log("Inserting data:", { name, email: email.toLowerCase() });

        // Add user to the database
        await db.query(
            "INSERT INTO project (name, email, password) VALUES($1, $2, $3)",
            [name, email.toLowerCase(), hashedPassword]
        );

        res.status(201).send({ message: 'User signed up successfully!' });
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).send({ error: 'Database error' });
    }
});


//get request to fetch the data.
app.get("/setWasteData", async (req, res) => {
    try {
        const result = await db.query("SELECT waste_type, weight FROM waste_data");
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching waste data:', error);
        res.status(500).send({ error: 'Database error' });
    }
})


// POST request to add waste amount and waste category to the database.
app.post("/getWasteData", async (req, res) => {
    const { wasteType, weight } = req.body;

    try {
        // Query to check if the waste type already exists
        const queryResult = await db.query(
            "SELECT weight FROM waste_data WHERE waste_type = $1",
            [wasteType]
        );

        if (queryResult.rows.length === 0) {
            // If waste type does not exist, insert new record
            await db.query(
                "INSERT INTO waste_data (waste_type, weight) VALUES ($1, $2)",
                [wasteType, weight]
            );
            res.status(201).send({ message: 'Waste data stored successfully!' });
        } else {
            // If waste type exists, update the weight
            const previousWeight = queryResult.rows[0].weight;
            const finalWeight = Number(previousWeight) + Number(weight); // Add the new weight to the previous weight

            await db.query(
                "UPDATE waste_data SET weight = $1 WHERE waste_type = $2",
                [finalWeight, wasteType]
            );
            res.status(200).send({ message: 'Waste data updated successfully!' });
        }
    } catch (error) {
        console.error('Error storing waste data:', error);
        res.status(500).send({ error: 'Database error' });
    }
});


// app.post("/getWasteData", async (req, res) => {
//     const { wasteType, weight } = req.body;
//     try {
//         await db.query(
//             "INSERT INTO waste_data (waste_type, weight) VALUES ($1, $2)",
//             [wasteType, weight]
//         );
//         res.status(201).send({ message: 'Waste data stored successfully!' });
//     } catch (error) {
//         console.error('Error storing waste data:', error);
//         res.status(500).send({ error: 'Database error' });
//     }
// });


// Start server
app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});
