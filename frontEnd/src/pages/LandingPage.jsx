import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaMotorcycle,
  FaStore,
  FaArrowRight,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaBars,
  FaTimes,
  FaBoxOpen,
  FaLocationArrow,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { FaMapLocationDot } from "react-icons/fa6";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Stats logic
  const statsRef = useRef(null);
  const [started, setStarted] = useState(false);
  const statsData = [
    { label: "Happy Users", value: 2480 },
    { label: "Partner Restaurants", value: 500 },
    { label: "Orders Delivered", value: 3000 },
    { label: "Delivery Partners", value: 200 },
  ];
  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, [started]);

  useEffect(() => {
    if (!started) return;
    statsData.forEach((stat, i) => {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCounts((prev) => {
          const updated = [...prev];
          updated[i] = Math.floor(start);
          return updated;
        });
      }, 16);
    });
  }, [started]);

  return (
    <div className="min-h-screen bg-[#fafff6] flex items-center flex-col scroll-smooth">
      {/* Navbar */}
      <nav
        className="w-full lg:max-w-[70%] sm:max-w-[100%] mt-2 mx-auto bg-gray-500/20 backdrop-blur-md 
        border border-white/30 shadow-xl py-4 px-6 rounded-4xl flex justify-between items-center fixed top-0 z-50"
      >
        <h1 className="text-2xl font-bold text-[#28A853]">FoodieExpress</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          
          <a href="#features" className="text-gray-600 hover:text-[#28A853] font-medium text-lg transition duration-300">
            Features
          </a>
          <a href="#stats" className="text-gray-600 hover:text-[#28A853] font-medium text-lg transition duration-300">
            Stats
          </a>
          <a href="#roles" className="text-gray-600 hover:text-[#28A853] font-medium text-lg transition duration-300">
            Join As
          </a>
          
          <button
            className="bg-[#28A853] hover:bg-[#1f7e3f] cursor-pointer text-white px-5 py-2 rounded-xl shadow transition"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white flex flex-col items-center gap-4 py-5 shadow-md md:hidden">
            <a href="#features" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-[#28A853] font-medium transition">
              Features
            </a>
            <a href="#stats" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-[#28A853] font-medium transition">
              Stats
            </a>
            <a href="#roles" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-[#28A853] font-medium transition">
              Join As
            </a>
            
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/signin");
              }}
              className="bg-[#28A853] hover:bg-[#1f7e3f] text-white px-5 py-2 rounded-xl shadow transition"
            >
              Sign In
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-32 pb-20 gap-10">
        <motion.div className="flex-1" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            Fast, Fresh & <span className="text-[#28A853]">Delicious</span> <br /> Food Delivered To You 🍴
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Order your favorite meals from local restaurants and get them delivered quickly — whether you're a foodie, a shop owner, or a delivery hero!
          </p>
          <button
            className="bg-[#28A853] hover:bg-[#1f7e3f] text-white px-7 py-3 rounded-xl shadow-lg text-lg flex cursor-pointer items-center gap-2 transition"
            onClick={() => navigate("/signup")}
          >
            Get Started <FaArrowRight />
          </button>
        </motion.div>

        <motion.div className="flex-1 flex justify-center" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
            alt="Food delivery illustration"
            className="w-80 md:w-[420px] drop-shadow-lg"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 px-6 md:px-20">
        <motion.h2
          className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Why Choose <span className="text-[#28A853]">FoodieExpress</span>?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FaBoxOpen size={50} className="text-yellow-500  mb-4" />,
              title: "Food Delivered to Your Doorstep",
              desc: "Your favorite dishes delivered to your doorstep by our trusted delivery partners.",
            },
            {
              icon: <FaStore size={50} className="text-orange-500 mb-4" />,
              title: "Multiple Restaurants",
              desc: "Explore thousands of restaurants and cafes near you and enjoy unlimited choices.",
            },
            {
              icon: <FaMapLocationDot  size={50} className="text-red-500 mb-4" />,
              title: "Live Tracking",
              desc: "Track your order live and know exactly when your delicious meal will arrive.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-[#fafff6] border border-gray-100 p-8 flex flex-col items-center rounded-2xl shadow hover:shadow-lg transition"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {feature.icon}
              <h3 className="text-2xl  font-semibold text-[#28A853] mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/*  STATS SECTION */}
      <section id="stats" ref={statsRef} className="bg-[#fafff6] py-20 px-6 md:px-20 border-t border-gray-100">
        <motion.h2
          className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Delivering Happiness, One Meal at a Time  
        </motion.h2>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statsData.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-100"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#28A853]">{counts[i].toLocaleString()}</h2>
              <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-16 px-6 md:px-20 bg-[#fafff6]">
        <motion.h2
          className="text-center text-3xl md:text-4xl font-bold text-gray-800 mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Join FoodieExpress As
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <FaUtensils size={50} className="text-[#28A853] mb-4" />,
              title: "User",
              desc: "Discover amazing dishes and order from your favorite restaurants anytime, anywhere.",
              color: "bg-[#28A853] hover:bg-[#1f7e3f]",
              button: "Sign Up",
            },
            {
              icon: <FaMotorcycle size={50} className="text-orange-500 mb-4" />,
              title: "Delivery Boy",
              desc: "Earn money delivering food to customers while exploring your city with flexibility.",
              color: "bg-orange-500 hover:bg-orange-600",
              button: "Join Now",
            },
            {
              icon: <FaStore size={50} className="text-red-500 mb-4" />,
              title: "Shop Owner",
              desc: "Expand your reach by joining our platform and serving thousands of customers online.",
              color: "bg-red-500 hover:bg-red-600",
              button: "Partner With Us",
            },
          ].map((role, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {role.icon}
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{role.title}</h3>
              <p className="text-gray-600 mb-4">{role.desc}</p>
              <button className={`${role.color} text-white px-5 py-2 rounded-xl cursor-pointer`} onClick={() => navigate("/signup")}>
                {role.button}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#002e00] text-gray-300 py-10 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-[#28A853] mb-3">FoodieExpress</h3>
            <p className="text-gray-400">Delivering happiness to your doorstep. Fast, fresh, and flavorful every time.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-[#28A853] transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-[#28A853] transition">
                  Join As
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#28A853] transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">Contact</h4>
            <p>Email: support@foodieexpress.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 text-white">Follow Us</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="hover:text-[#28A853] transition">
                <FaFacebook size={22} />
              </a>
              <a href="#" className="hover:text-[#28A853] transition">
                <FaInstagram size={22} />
              </a>
              <a href="#" className="hover:text-[#28A853] transition">
                <FaTwitter size={22} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} FoodieExpress. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
