const express = require("express");
const cors = require("cors");
const pool = require("./app/database/db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./app/routes/jwtAuth"))


//create user
app.post("/accounts", async(req, res) => {
    try{
        const {username} = req.body;
        const {pwd} = req.body;
        const newUser = await pool.query("INSERT INTO users (username, pwd) VALUES($1, $2) RETURNING *", 
        [username, pwd]);

        res.json("account added")
        res.json(newUser.rows[0]);
        

    } catch(err) {
        console.error(err.message);
    }
});

//get all users
app.get("/accounts", async(req, res) => {
    try {
        const allAccounts = await pool.query(
            "SELECT * FROM users"
            );
        res.json(allAccounts.rows);
    } catch(err) {
        console.error(err.message);
    }
});


//get a user
app.get("/accounts/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        res.json(user.rows[0]);

    } catch(err) {
        console.error(err.message);
    }
});

//update a password
app.put("/accounts/:id", async(req, res)=> {
    try {
      const {id} = req.params;
      const {pwd} = req.body;
      const updatePwd = await pool.query("UPDATE users SET pwd = $1 WHERE id = $2", [pwd, id]);
        
        res.json("password updated");
    } catch(err) {
        console.error(err.message);
    }
});

//delete a user
app.delete("/accounts/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deleteUser = await pool.query("DELETE FROM users WHERE id = $1", [id]);

        res.json("user deleted!");

    } catch(err) {
        console.error(err.message);
    }
});



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

