import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  LogIn,
  LogOut,
} from "lucide-react";

interface ScanSuccessProps {
  open: boolean;
  title: string;
  message: string;
  type: "checkin" | "checkout";
}

const ScanSuccess = ({
  open,
  title,
  message,
  type,
}: ScanSuccessProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
          }}
          transition={{
            duration: 0.3,
          }}
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
          "
        >
          <motion.div
            initial={{
              y: 30,
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: 30,
            }}
            className="
              w-full
              max-w-md
              rounded-3xl
              bg-white
              p-8
              shadow-2xl
              text-center
            "
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
              className="
                mx-auto
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-green-100
              "
            >
              <CheckCircle2
                size={56}
                className="text-green-600"
              />
            </motion.div>

            <h2 className="mt-6 text-3xl font-bold text-slate-800">
              {title}
            </h2>

            <p className="mt-3 text-slate-500">
              {message}
            </p>

            <div
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-slate-100
                py-4
              "
            >
              {type === "checkin" ? (
                <>
                  <LogIn
                    className="text-green-600"
                    size={24}
                  />

                  <span className="font-semibold text-green-700">
                    Visitor Checked In
                  </span>
                </>
              ) : (
                <>
                  <LogOut
                    className="text-blue-600"
                    size={24}
                  />

                  <span className="font-semibold text-blue-700">
                    Visitor Checked Out
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScanSuccess;