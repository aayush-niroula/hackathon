import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountdownTimer from "./RegisterTimer";
import axios from "axios";

// Custom hook for form validation
const useFormValidation = () => {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    semester: "",
    general: "",
  });

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateForm = useCallback((formData: {
    name: string;
    email: string;
    semester: string;
  }) => {
    const { name, email, semester } = formData;
    const newErrors = { name: "", email: "", semester: "", general: "" };
    let valid = true;

    if (!name.trim()) {
      newErrors.name = "Full name is required";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!semester) {
      newErrors.semester = "Please select your semester";
      valid = false;
    }

    return { valid, errors: newErrors };
  }, [validateEmail]);

  return useMemo(() => ({ 
    errors, 
    setErrors, 
    validateForm 
  }), [errors, validateForm]);
};

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    semester: "",
  });
  const { errors, setErrors, validateForm } = useFormValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "", general: "" }));
    setSuccessMessage("")
  }, [setErrors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { valid, errors: validationErrors } = validateForm(formData);
    
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/api/v1/user/register", formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000 // 5 second timeout
      });
      
      setSuccessMessage("Registration successful! Thank you for participating.");
      setFormData({ name: "", email: "", semester: "" });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 
        error.message || 
        "Registration failed. Please try again.";
      
      setErrors(prev => ({ ...prev, general: errorMsg }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, setErrors]);

  const formVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }), []);

  const inputFields = useMemo(() => [
    { 
      id: 'name', 
      label: 'Full Name', 
      type: 'text', 
      placeholder: 'Enter your full name' 
    },
    { 
      id: 'email', 
      label: 'Email Address', 
      type: 'email', 
      placeholder: 'Enter your email' 
    }
  ], []);

  const deadline = '2024-12-16T20:00:00';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <motion.img 
            variants={itemVariants}
            src="/images.png" 
            alt="Aims Code Quest 2.0" 
            className="mx-auto h-16 mb-4 rounded-lg shadow-md"
          />
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold"
          >
            Aims Code Quest 2.0
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-sm text-blue-100 mt-2"
          >
            "Participate and unleash your potential!"
          </motion.p>
        </div>

                {/* Countdown Timer */}
                <CountdownTimer deadline={deadline} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <AnimatePresence>
            {errors.general && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-center"
              >
                {errors.general}
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-center"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {inputFields.map(({ id, label, type, placeholder }) => (
            <motion.div
              key={id}
              variants={itemVariants}
            >
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id as keyof typeof formData]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 
                  ${errors[id as keyof typeof errors] 
                    ? "border-red-500 focus:ring-red-300 bg-red-50" 
                    : "border-gray-300 focus:ring-blue-300 focus:border-blue-500 bg-gray-50"}`}
                placeholder={placeholder}
                required
                disabled={isSubmitting}
              />
              {errors[id as keyof typeof errors] && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-2 flex items-center"
                >
                  {errors[id as keyof typeof errors]}
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <div className="relative">
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg appearance-none focus:outline-none focus:ring-2 transition-all duration-300
                  ${errors.semester 
                    ? "border-red-500 focus:ring-red-300 bg-red-50" 
                    : "border-gray-300 focus:ring-blue-300 focus:border-blue-500 bg-gray-50"}`}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Your Semester</option>
                <option value="first">1st Semester</option>
                <option value="third">3rd Semester</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {errors.semester && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-2"
              >
                {errors.semester}
              </motion.p>
            )}
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`w-full py-3 px-4 text-white font-semibold rounded-lg 
              ${isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              } transition-all duration-300 shadow-lg`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="bg-gray-100 text-bold text-center py-3 text-md text-gray-600">
          Organized by CSIT 6th Semester Students
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;