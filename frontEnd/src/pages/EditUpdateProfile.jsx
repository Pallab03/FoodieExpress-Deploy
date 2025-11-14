
import React from 'react'
import { useState, useEffect } from "react";
import { User, Calendar, Save, ArrowDown, Camera, Mail, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router';


function EditUpdateProfile() {
    const [profile, setProfile] = useState({});
    const navigate =  useNavigate()
    const { userData } = useSelector(state => state.user)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)

    useEffect(() => {
        const isoDate = userData.user?.dob;
        let formattedDate;
        if (userData.user?.dob)
            formattedDate = new Date(isoDate).toISOString().split("T")[0];



        setProfile({
            fullName: userData.user.fullName,
            email: userData.user.email,
            phoneNumber: userData.user.mobile, // New editable field
            gender: userData.user?.gender || "Male",
            dob: userData.user.dob ? formattedDate : '',
            // Using a more vibrant background placeholder color (orange/red hint)

        })
        setFrontendImage(userData.user?.profilePicture || null)
    }, [userData])

    const [statusMessage, setStatusMessage] = useState({
        text: '',
        type: 'success' // or 'error'
    });
    const [isSaving, setIsSaving] = useState(false);

    // Available gender options for the select dropdown
    const genderOptions = [
        'Male',
        'Female',
        'Others',
        'Prefer not to say',
    ];

    // Handler for text, date, and select inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a temporary URL for image preview
            setFrontendImage(URL.createObjectURL(file))
            setBackendImage(file);
            setProfile(prev => ({
                ...prev,
                profilePicture: file,
            }));
            // console.log(backendImage)
        }


    };

    // Handler for saving the profile (mock API call)
    const handleSave = async (e) => {
        e.preventDefault();
        // if (backendImage) {
        //     console.log(backendImage)

        // }
        const formData = new FormData();
        formData.append("fullName", profile.fullName);
        formData.append("gender", profile.gender);
        formData.append("dob", profile.dob);

        if (profile.profilePicture) {
            formData.append("profilePicture", profile.profilePicture); // must match multer key
        }

        setIsSaving(true);
        setStatusMessage({ text: '', type: 'success' });

        console.log(profile)

        try {
            const result = await axios.post(`${serverUrl}/api/user/edit-update-profile`, formData, { withCredentials: true });
            setIsSaving(false);
            const savedSummary = `${result.data.message} 
        Enjoy your next order, ${profile.name}!
        Email: ${profile.email},
        Phone: ${profile.phoneNumber}.`;

            setStatusMessage({
                text: savedSummary.replace(/\s+/g, ' ').trim(),
                type: 'success'
            });
        } catch (error) {
            setStatusMessage({
                text: "Something is wrong :(",
                type: 'error'
            });
            setIsSaving(false);
            console.log(error)

        }




    };
    return (
        <div className="min-h-screen bg-[#f7fff6] p-4 sm:p-8 flex items-center justify-center font-[Inter]">

            <div className="absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer"
                onClick={() => navigate('/home')}>
                <IoIosArrowRoundBack size={40} className='text-[#28A853]' />
            </div>
            {/* Increased shadow and border radius for a better app aesthetic */}
            <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-6 sm:p-10 border border-gray-100">

                {/* Header - Using a rich red color */}
                <h1 className="text-3xl font-extrabold text-red-700 mb-6 border-b-2 pb-3 border-red-200">
                    My Account Details
                </h1>

                <form onSubmit={handleSave}>
                    {/* Profile Picture Upload Section */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative w-42 h-42 mb-2">
                            <img
                                src={frontendImage || (userData?.user?.fullName ? `https://placehold.co/100x100/F97316/FFFFFF?text=${userData.user.fullName.slice(0, 1)}`
                                    : "https://placehold.co/100x100/F97316/FFFFFF?text=?")}
                                alt="Profile"
                                // Border in the main brand color (red)
                                className="w-full h-full object-cover rounded-full border-4 border-red-500 shadow-xl"
                            />
                            {/* Overlay for file input trigger */}
                            <label
                                htmlFor="profile-picture-upload"
                                className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
                                title="Change Profile Picture"
                            >
                                <Camera className="w-6 h-6 text-white" />
                                <span className="sr-only">Upload Picture</span>
                            </label>
                        </div>
                        <input
                            type="file"
                            id="profile-picture-upload"
                            accept="image/*"
                            onChange={handlePictureChange}
                            className="hidden" // Hide the default file input
                        />

                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">

                        {/* Full Name */}
                        <div className="relative">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    name="fullName"
                                    type="text"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-red-500 focus:border-red-500 transition duration-150"
                                />
                                {/* Icon in brand accent color */}
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    disabled
                                    type="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border bg-gray-200 border-gray-300 rounded-xl shadow-inner focus:ring-red-500 focus:border-red-500 transition duration-150"
                                />
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="relative">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    disabled
                                    type="tel"
                                    value={profile.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+91-0000000000"
                                    className="w-full pl-10 pr-4 py-3 border bg-gray-200 border-gray-300 rounded-xl shadow-inner focus:ring-red-500 focus:border-red-500 transition duration-150"
                                />
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400" />
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="relative">
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    value={profile.dob}
                                    onChange={handleChange}
                                    // Set max date to today to prevent future dates
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-red-500 focus:border-red-500 transition duration-150"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Gender Select */}
                        <div className="relative">
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                Gender
                            </label>
                            <div className="relative">
                                <select
                                    id="gender"
                                    name="gender"
                                    value={profile.gender}
                                    onChange={handleChange}
                                    className="w-full cursor-pointer pl-4 pr-10 py-3 border border-gray-300 rounded-xl shadow-inner appearance-none focus:outline-none focus:ring-red-500 focus:border-red-500 transition duration-150"
                                >
                                    {genderOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                <ArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-400 pointer-events-none" />
                            </div>
                        </div>

                    </div>

                    {/* Save Button - Vibrant red with large shadow */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`mt-8 w-full cursor-pointer flex items-center justify-center px-4 py-3 border border-transparent text-base font-bold rounded-xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.01]
              ${isSaving
                                // Saving state: lighter red
                                ? 'bg-red-400 cursor-not-allowed text-white shadow-md'
                                // Default state: primary brand color
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-green-300/30'}`}
                    >
                        {isSaving ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Save className="h-5 w-5 mr-2" />
                                Save Delicious Changes
                            </span>
                        )}
                    </button>
                </form>

                {/* Status Message - Using Green for success/order confirmation feel */}
                {statusMessage.text && (
                    <div
                        className={`mt-6 p-4 rounded-xl text-sm transition-all duration-300 font-medium ${statusMessage.type === 'success'
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                            }`}
                    >
                        <pre className="whitespace-pre-wrap font-sans">{statusMessage.text}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditUpdateProfile
