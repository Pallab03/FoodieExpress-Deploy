import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body
        let user = await User.findOne({ email });



        if (user)
            return res.status(400).json({ message: "User allready exist" })

        if (password.length < 6)
            return res.status(400).json({ message: "password must be at least 6 charecters." })

        if (mobile.length !== 10)
            return res.status(400).json({ message: "please giving your valid mobile Number." })

        req.body.password = await bcrypt.hash(password, 10);

        user = await User.create(req.body);

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httponly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000  //7 days
        })

        const reply = {
            fullName: user.fullName,
            email: user.email,
            _id: user._id,
            role: user.role,
            mobile: user.mobile,
            location:user.location,
            dob:user.dob,
            profilePicture:user.profilePicture,
            gender:user.gender
        }

        return res.status(201).json({
            user: reply,
            message: "user Register Successfully."
        })

    } catch (error) {
        return res.status(500).json(`sign Up Error ${error}`)
    }
}

export const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Please Enter Your Email" })

    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({ message: "User does not Exisit." })



        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false
        await user.save()
        sendOtpMail(email, otp)
        return res.status(200).json({ message: "Otp Send Successfully" })

    } catch (error) {
        return res.status(500).json({ message: `Error For Sending Otp ${error}` })

    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User does not Exisit." })

        if (user.resetOtp != otp)
            return res.status(400).json({ message: "Invalid Otp." })

        if (user.otpExpires < Date.now())
            return res.status(400).json({ message: "Expired Otp" })
        user.resetOtp = undefined;
        user.isOtpVerified = true;
        user.otpExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Otp Verify Successfully" })


    } catch (error) {
        return res.status(500).json({ message: `Error For verifing Otp ${error}` })

    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email||!password)
            return res.status(400).json({ message: "Email and password are required" })
            
        const user = await User.findOne({ email });
        // console.log(user)

        if (!user)
            return res.status(400).json({ message: "User does not exist" });

        if (!user.password)
            return res.status(400).json({ message: "Plesae login with google" });

        const match = await bcrypt.compare(password, user.password);

        // console.log(match)

        if (!match)
            return res.status(400).json({ message: "Invalid Password." })


        const token = await genToken(user._id);

        res.cookie("token", token, {
            httponly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000  //7 days
        })

        const reply = {
            fullName: user.fullName,
            email: user.email,
            _id: user._id,
            role: user.role,
            mobile: user.mobile,
            location:user.location,
            dob:user.dob,
            profilePicture:user.profilePicture,
            gender:user.gender
        }

        return res.status(200).json({
            user: reply,
            message: "user Sign In Successfully."
        })

    } catch (error) {
        return res.status(500).json(`sign In Error ${error}`)
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User does not Exisit." })
        if (!user.isOtpVerified)
            return res.status(400).json({ message: "Email is not Verified." })

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({ message: "Password reset Successfully" })




    } catch (error) {
        return res.status(500).json({ message: `Error For Reseting Password ${error}` })
    }
}

export const signOut = (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "log out Successfully." })
    } catch (error) {
        return res.status(500).json(`log out Error ${error}`)

    }
}

export const googleAuth = async (req, res) => {
    try {
        const { fullName, email, mobile,role } = req.body
        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                fullName, email, mobile,role
            })

        }

        const token = await genToken(user._id);
        console.log("token :",token)

        res.cookie("token", token, {
            httponly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000  //7 days
        })

        const reply = {
          fullName: user.fullName,
            email: user.email,
            _id: user._id,
            role: user.role,
            mobile: user.mobile,
            location:user.location,
            dob:user.dob,
            profilePicture:user.profilePicture,
            gender:user.gender
        }

        return res.status(200).json({
            user: reply,
            message: "user Register Successfully."
        })


    } catch (error) {
        return res.status(500).json(`googlwAuth Error ${error}`)

    }
}