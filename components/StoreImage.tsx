import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface StoreImageProps {
  isRTL: boolean;
}

const StoreImage: React.FC<StoreImageProps> = ({ isRTL }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="flex-1 relative w-full mt-4 sm:mt-0"
    >
      <div className="aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
        <Image
          src="/asd.jpg"
          width={1290}
          height={1290}
          alt="ASD - Auto Spa Detailing Showroom"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 bg-gradient-to-r from-blue-600/90 to-blue-800/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-lg"
      >
        <p className="text-white text-sm sm:text-lg font-medium">
          احترافية، مصداقية، وخدمة تفوق التوقعات.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default StoreImage; 