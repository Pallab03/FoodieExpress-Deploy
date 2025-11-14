import User from "../models/userModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(500).json({ message: "User Id is Not Found" })
        const user = await User.findOne({ _id: userId });
        if (!user)
            return res.status(500).json({ message: "User is Not Found" })

        const reply = {
            fullName: user.fullName,
            email: user.email,
            _id: user._id,
            role: user.role,
            mobile: user.mobile,
            location: user.location,
            dob:user.dob,
            profilePicture:user.profilePicture,
            gender:user.gender
        }
        res.status(200).json({ user: reply })
    } catch (error) {
        res.status(500).json({ message: `Error to get Current user ${error} ` })

    }
}

export const updateUserLocation = async (req, res) => {
    try {
        const { lat, lon } = req.body
        const user = await User.findByIdAndUpdate(req.userId, {
            location: {
                type: 'Point',
                coordinates: [lon, lat]   //stored first longitude then latitude
            }
        }, { new: true });
        if (!user)
            return res.status(500).json({ message: "User is Not Found" })

        return res.status(200).json({ message: "Location upadated" })
    } catch (error) {
        res.status(500).json({ message: `Error to update user location user ${error} ` })

    }
}

export const editUpdateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { fullName, gender, dob } = req.body
        if (!fullName || fullName.length < 3)
            return res.status(400).json( {message:"Full Name is required"})

        let updateData = { fullName, gender, dob };
        //check if date of birth is blank
        if(dob=='')
            updateData = {fullName, gender}

        if (req.file) {
            console.log("update Profile picture run")
            const profilePicture = await uploadOnCloudinary(req.file.path)
            updateData.profilePicture = profilePicture; // only add image if new one is uploaded
        }

        const user = await User.findByIdAndUpdate(userId,updateData,{new:true})

        if(!user)
            return res.status(400).json({message:"User does not Found"})

        return res.status(200).json({message:"User Updated Successfully"})

    } catch (error) {
        res.status(500).json({ message: `Error to Edit or update user Profile ${error} ` })

    }
}



