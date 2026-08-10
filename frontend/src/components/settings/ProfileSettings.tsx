import { useState } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, Camera } from "lucide-react";
import { toast } from "react-hot-toast";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    fullName: "Pankaj Kumar",
    email: "pankaj@example.com",
    phone: "+91 9876543210",
    designation: "Administrator",
    department: "Security",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    // TODO: Call backend API
    toast.success("Profile updated successfully.");
  };

  const handleReset = () => {
    setProfile({
      fullName: "Pankaj Kumar",
      email: "pankaj@example.com",
      phone: "+91 9876543210",
      designation: "Administrator",
      department: "Security",
    });

    toast.success("Profile reset.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          Profile Settings
        </h2>

        <p className="mt-2 text-slate-500">
          Manage your personal profile information.
        </p>
      </div>

      {/* Avatar */}

      <div className="mb-10 flex flex-col items-center">

        <div className="relative">

          <img
            src="https://ui-avatars.com/api/?name=Pankaj+Kumar&background=2563eb&color=fff&size=160"
            alt="Profile"
            className="h-36 w-36 rounded-full border-4 border-blue-100 object-cover"
          />

          <button
            className="absolute bottom-2 right-2 rounded-full bg-blue-600 p-3 text-white shadow-lg transition hover:bg-blue-700"
          >
            <Camera size={18} />
          </button>

        </div>

        <p className="mt-4 text-sm text-slate-500">
          Click the camera icon to change profile photo.
        </p>

      </div>

      {/* Form */}

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Email Address
          </label>

          <input
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Phone Number
          </label>

          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Designation
          </label>

          <input
            name="designation"
            value={profile.designation}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Department
          </label>

          <input
            name="department"
            value={profile.department}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* Buttons */}

      <div className="mt-10 flex flex-wrap gap-4">

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <Save size={18} />
          Save Changes
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100"
        >
          <RotateCcw size={18} />
          Reset
        </button>

      </div>
    </motion.div>
  );
};

export default ProfileSettings;