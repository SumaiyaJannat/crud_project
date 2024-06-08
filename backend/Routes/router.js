const express = require("express");
const router = new express.Router();
const conn = require("../db/conn");

// register user data
router.post("/create", (req, res) => {
    const { name, email, mobile, profession, interests, bio } = req.body;

    if (!name || !email || !mobile || !profession || !interests || !bio) {
        res.status(422).json("Please fill in all required fields.");
        return;
    }

    try {
        conn.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
            if (result.length) {
                res.status(422).json("User with this email already exists.");
            } else {
                conn.query("INSERT INTO users SET ?", { name, email, mobile, profession, interests, bio }, (err, result) => {
                    if (err) {
                        console.error("Error creating user:", err);
                        res.status(500).json("Internal server error.");
                    } else {
                        res.status(201).json("User created successfully.");
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json("Internal server error.");
    }
});

// get userdata
router.get("/getusers", (req, res) => {
    conn.query("SELECT * FROM users", (err, result) => {
        if (err) {
            res.status(422).json("No data available.");
        } else {
            res.status(200).json(result);
        }
    });
});

// user delete api
router.delete("/deleteuser/:id", (req, res) => {
    const { id } = req.params;
    conn.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
        if (err) {
            res.status(422).json("Error deleting user.");
        } else {
            res.status(200).json("User deleted successfully.");
        }
    });
});

// get single user
router.get("/induser/:id", (req, res) => {
    const { id } = req.params;
    conn.query("SELECT * FROM users WHERE id = ?", id, (err, result) => {
        if (err) {
            res.status(422).json("Error fetching user data.");
        } else {
            res.status(200).json(result);
        }
    });
});

// update users api
router.patch("/updateuser/:id", (req, res) => {
    const { id } = req.params;
    const data = req.body;
    conn.query("UPDATE users SET ? WHERE id = ?", [data, id], (err, result) => {
        if (err) {
            res.status(422).json("Error updating user.");
        } else {
            res.status(200).json("User updated successfully.");
        }
    });
});

module.exports = router;
