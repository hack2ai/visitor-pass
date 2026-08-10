import {
  FaShieldAlt,
  FaUserShield,
  FaLock,
  FaUserCheck,
} from "react-icons/fa";

const LoginBanner = () => {
  return (
    <div
      className="
        hidden
        lg:flex
        flex-col
        justify-center
        items-center
        bg-gradient-to-br
        from-blue-700
        via-blue-600
        to-indigo-700
        text-white
        p-12
      "
    >
      {/* Logo */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-full shadow-2xl border border-white/20">
        <FaShieldAlt
          size={80}
          className="text-white"
        />
      </div>

      {/* Project Title */}
      <h1 className="mt-8 text-5xl font-extrabold tracking-wide text-center">
        Pankaj Kumar
      </h1>

      <h2 className="mt-3 text-3xl font-semibold text-blue-100 text-center">
        Visitor Pass Management
      </h2>

      {/* Description */}
      <p className="mt-6 text-lg text-blue-100 text-center leading-relaxed max-w-md">
        Smart & Secure Visitor Management Platform
        <br />
        Built with React, TypeScript, Node.js,
        Express, Prisma & AI
      </p>

      {/* Divider */}
      <div className="w-24 h-1 bg-white/40 rounded-full mt-8"></div>

      {/* Features */}
      <div className="mt-10 space-y-6">

        <div className="flex items-center gap-4">
          <FaUserShield
            size={26}
            className="text-green-300"
          />
          <span className="text-lg font-medium">
            Secure Authentication
          </span>
        </div>

        <div className="flex items-center gap-4">
          <FaLock
            size={26}
            className="text-yellow-300"
          />
          <span className="text-lg font-medium">
            Role Based Access Control
          </span>
        </div>

        <div className="flex items-center gap-4">
          <FaShieldAlt
            size={26}
            className="text-cyan-300"
          />
          <span className="text-lg font-medium">
            AI Powered Security
          </span>
        </div>

        <div className="flex items-center gap-4">
          <FaUserCheck
            size={26}
            className="text-pink-300"
          />
          <span className="text-lg font-medium">
            Smart Visitor Verification
          </span>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-blue-100 font-semibold">
          Pankaj Kumar Visitor Pass Management System
        </p>

        <p className="mt-2 text-sm text-blue-200">
          React • TypeScript • Node.js • Express • Prisma • PostgreSQL
        </p>

        <p className="mt-4 text-xs text-blue-300">
          © 2026 Pankaj Kumar. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginBanner;