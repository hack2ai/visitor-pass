import { motion } from "framer-motion";

const ScanOverlay = () => {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Scanner Frame */}
      <div className="relative h-72 w-72 rounded-2xl border-2 border-white">

        {/* Top Left */}
        <div className="absolute -left-1 -top-1 h-10 w-10 border-l-4 border-t-4 border-blue-500 rounded-tl-xl" />

        {/* Top Right */}
        <div className="absolute -right-1 -top-1 h-10 w-10 border-r-4 border-t-4 border-blue-500 rounded-tr-xl" />

        {/* Bottom Left */}
        <div className="absolute -bottom-1 -left-1 h-10 w-10 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />

        {/* Bottom Right */}
        <div className="absolute -bottom-1 -right-1 h-10 w-10 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

        {/* Animated Scan Line */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 260 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          className="absolute left-0 right-0 h-1 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
        />
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 text-center text-white">
        <p className="text-lg font-semibold">
          Place the QR code inside the frame
        </p>

        <p className="mt-2 text-sm opacity-80">
          The scanner will detect it automatically
        </p>
      </div>
    </div>
  );
};

export default ScanOverlay;