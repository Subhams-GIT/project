const express = require('express');
const app = express();
const PORT = 3000;
const router = express.Router();
const z = require('zod');
const { User, account } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require('jsonwebtoken');
const authMiddleware = require('./Middleware');
const bcrypt=require('bcrypt')
// Schema validations
const signup = z.object({
    username: z.string().email(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string(),
});

const signin = z.object({
    username: z.string().email(),
    password: z.string(),
});


router.post("/signup", async (req, res) => {
    const { success, error } = signup.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            msg: "Invalid data",
            error: error.errors,
        });
    }

    const result = await User.findOne({
        username: req.body.username
    });

    if (result) {
        return res.status(409).json({
            msg: "User already registered"
        });
    }
    
    const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
    });

    const userId = newUser._id;

    await account.create({
        userId,
        balance: Math.random() * 10000
    });

    const token = jwt.sign({ userId }, JWT_SECRET);
    res.status(201).json({
        msg: "User created!",
        token: token
    });
});

// Signin route
router.post("/signin", async (req, res) => {
    const { success, error } = signin.safeParse(req.body);

    if (!success) {
        return res.status(400).json({
            msg: "Invalid credentials",
            error: error.errors,
        });
    }

    const userDet = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (!userDet) {
        return res.status(401).json({
            msg: "Please create an account first"
        });
    }
    
    const token = jwt.sign({
        userId: userDet._id
    }, JWT_SECRET);

    res.json({
        userDet:userDet,
        token: token
    });
});

// Update user route
const updateBody = z.object({
    password: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
    const { success, error } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid update data",
            error: error.errors,
        });
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    });
});

// Bulk search route
router.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstname: { "$regex": filter, "$options": "i" } },
            { lastname: { "$regex": filter, "$options": "i" } }
        ],
        _id: { $ne: req.userId } 
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
});

module.exports = router;
