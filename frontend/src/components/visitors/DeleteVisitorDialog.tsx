import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  visitorName: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteVisitorDialog = ({
  open,
  visitorName,
  loading = false,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}

            <div className="border-b p-6">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-red-100 p-3">

                  <AlertTriangle
                    size={26}
                    className="text-red-600"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Delete Visitor
                  </h2>

                  <p className="text-sm text-slate-500">
                    This action cannot be undone.
                  </p>

                </div>

              </div>

            </div>

            {/* Body */}

            <div className="p-6">

              <p className="text-slate-700 leading-7">

                Are you sure you want to delete

                <span className="font-semibold">
                  {" "}
                  {visitorName}
                </span>

                ?

              </p>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t p-6">

              <button
                disabled={loading}
                onClick={onClose}
                className="
                  rounded-xl
                  border
                  px-5
                  py-2.5
                  hover:bg-slate-100
                "
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={onConfirm}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-5
                  py-2.5
                  text-white
                  hover:bg-red-700
                  disabled:opacity-60
                "
              >
                {loading && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                Delete Visitor

              </button>

            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteVisitorDialog;