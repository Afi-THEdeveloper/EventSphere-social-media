import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const ContactCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{scale:1.012}}
      className="myDivBg p-6 rounded-md shadow-md text-white mb-4 fixed top-40"
    >
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <div className="flex items-center mb-2">
        <span className="mr-2">&#128231;</span>
        <p>afiafsal6023@gmail.com</p>
      </div>
      <div className="flex items-center mb-2">
        <span className="mr-2">
          <FaFacebook />
        </span>
       <Link to={'https://www.facebook.com/afi.afsal.9421/'}><p>Facebook </p></Link> 
      </div>
      <div className="flex items-center mb-2">
        <span className="mr-2">
          <FaInstagram />
        </span>
        <Link to={'https://www.instagram.com/_af.5.al_/'}><p>Instagram</p></Link>
      </div>
      <div className="flex items-center">
        <span className="mr-2">
          <FaLinkedinIn />
        </span>
        <Link to={'https://www.linkedin.com/in/mohamed-afsal-p-b38384271/'}><p>Linkedin</p></Link>
      </div>
    </motion.div>
  );
};

export default ContactCard;