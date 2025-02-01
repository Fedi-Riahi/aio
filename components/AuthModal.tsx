"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean; 
  onClose: () => void; 
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggles between Login and Signup

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose} // Close modal on outside click
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>

            {/* Form */}
            <form className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main dark:bg-neutral-800 dark:border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main dark:bg-neutral-800 dark:border-neutral-700"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            {/* Toggle Auth Mode */}
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleAuthMode}
                className="text-main hover:text-main/90 font-medium"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;