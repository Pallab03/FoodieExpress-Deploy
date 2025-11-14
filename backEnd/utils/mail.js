import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
// console.log(process.env.JWT_SECRET);

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "pallabdevcode@gmail.com",
        pass: process.env.MAIL_PASS,
    },
});

export const sendOtpMail = async (to,otp) => {
    await transporter.sendMail({
        from: '"Food-Delivery" <pallabdevcode@gmail.com>',
        to,
        subject: "Reset Your Password",
        text: "Reset Your Password", // plain‑text body
        html: `<p>Your OTP for Reset Password <b>${otp}</b>.It Expires in 5 Min.</p>`, // HTML body
    })
}

export const sendDeliveryOtpMail = async (user,otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to:user.email,
        subject: "Delivery OTP",
        text: "Delivery Confirm OTP", // plain‑text body
        html: `<p>Your OTP fo Delivery : <b>${otp}</b>.It Expires in 5 Min.</p>`, // HTML body
    })
}