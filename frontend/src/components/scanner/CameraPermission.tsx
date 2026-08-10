import { useState } from "react";
import { Camera, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface CameraPermissionProps {
  onRetry: () => void;
}

const CameraPermission = ({
  onRetry,
}: CameraPermissionProps) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);

    try {
      await Promise.resolve(onRetry());
    } finally {
      setTimeout(() => {
        setRetrying(false);
      }, 700);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="
        flex
        h-[500px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-8
        text-center
      "
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-full
          bg-red-100
        "
      >
        <Camera
          size={48}
          className="text-red-600"
        />
      </motion.div>

      <h2 className="mt-6 text-2xl font-bold text-slate-800">
        Camera Permission Required
      </h2>

      <p className="mt-3 max-w-md text-slate-500 leading-7">
        Camera access is required to scan visitor QR
        codes. Please allow permission in your browser
        and try again.
      </p>

      <button
        type="button"
        onClick={handleRetry}
        disabled={retrying}
        className="
          mt-8
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-blue-600
          px-6
          py-3
          font-medium
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:bg-slate-400
        "
      >
        <RefreshCcw
          size={18}
          className={retrying ? "animate-spin" : ""}
        />

        {retrying ? "Retrying..." : "Try Again"}
      </button>

      <p className="mt-6 text-sm text-slate-400">
        If permission is blocked permanently,
        enable the camera from your browser settings.
      </p>
    </motion.div>
  );
};

export default CameraPermission;