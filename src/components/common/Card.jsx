import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', onClick, hoverable = true }) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;