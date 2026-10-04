import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login Submitted:', formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-100 font-sans">
      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-xl shadow-lg px-8 py-10 text-center">
        {/* Top Icon */}
        <div className="mx-auto w-10 h-10 mb-4 flex items-center justify-center rounded-lg border border-gray-200 text-gray-700 bg-gray-50">
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Welcome Back!
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          Sign in to continue your journey
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              placeholder="me@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 text-gray-700 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 text-gray-700 placeholder:text-gray-400"
              required
            />
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs mt-1">
            <label className="flex items-center gap-2 text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-3.5 h-3.5 rounded border-gray-300 accent-black cursor-pointer"
              />
              Remember me
            </label>
            <a href="#forgot" className="text-gray-900 font-semibold hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 mt-2 text-xs font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-white px-3 text-gray-400">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {/* Apple */}
          <button
            type="button"
            className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.13c.67-.82 1.12-1.96.99-3.13-0.97.04-2.15.65-2.84 1.46-.62.72-1.16 1.88-1.02 3.02 1.09.08 2.2-.53 2.87-1.35z" />
            </svg>
          </button>

          {/* Google */}
          <button
            type="button"
            className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-sm text-gray-700">G</span>
          </button>

          {/* Infinity / Meta */}
          <button
            type="button"
            className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-bold text-lg leading-none"
          >
            ∞
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-xs text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="font-semibold text-gray-900 underline hover:text-black">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;