import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const registerUser = async (req, res) => {
    try{
        const { name, email, password, role} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        } 
        
        //check if user already exists
        const existingUser = await User.findOne({$or: [{name}, {email}]});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User with given name or email already exists",
            });
        }

        if (role === "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin role cannot be assigned via registration",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.toString(), salt);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: role|| "student",
        });

        await newUser.save();

        if (newUser) {
            res.status(201).json({
                success: true,
                message: "User registered successfully!",
            });
        } 
        else {
            res.status(400).json({
                success: false,
                message: "Unable to register user! please try again.",
            });
        }
    }catch(e){
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

const loginUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const user = await User.findOne({ $or: [{ name }, { email }] });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or email",
            });
        }

        const isMatch = await bcrypt.compare(password.toString(), user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Username or Password",
            });
        }

        const accessToken = jwt.sign(
            {
                userId: user._id,
                userRole: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken: accessToken,
        });
    }
    catch(e){
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

export { registerUser, loginUser };