import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

const Navbar = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header
      className="
        h-20
        bg-white
        border-b
        border-slate-200
        flex
        items-center
        justify-between
        px-8
        shadow-sm
      "
    >
      {/* Left */}

      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-slate-500">
          {today}
        </p>
      </div>

      {/* Center */}

      <div className="relative w-[420px]">

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="text"
          placeholder="Search visitors..."
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            py-3
            pl-12
            pr-4
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <button
          className="
            relative
            p-3
            rounded-full
            hover:bg-slate-100
          "
        >
          <Bell size={22} />

          <span
            className="
              absolute
              top-2
              right-2
              w-2
              h-2
              rounded-full
              bg-red-500
            "
          />
        </button>

        <div className="flex items-center gap-3">

          <UserCircle
            size={42}
            className="text-blue-600"
          />

          <div>

            <h4 className="font-semibold">
              Pankaj Kumar
            </h4>

            <p className="text-sm text-slate-500">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;