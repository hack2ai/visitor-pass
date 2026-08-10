import { useState } from "react";
import { motion } from "framer-motion";

import MainLayout from "../../components/layout/MainLayout";

import ScannerCamera from "../../components/scanner/ScannerCamera";
import ScanOverlay from "../../components/scanner/ScanOverlay";
import ScanResult from "../../components/scanner/ScanResult";
import ScanSuccess from "../../components/scanner/ScanSuccess";
import CameraPermission from "../../components/scanner/CameraPermission";

import { useScanner } from "../../hooks/useScanner";

const QRScanner = () => {
  const {
    visitor,
    loading,
    scannerKey,

    showSuccess,
    successType,

    handleScan,
    handleCheckIn,
    handleCheckOut,
    handleScanAgain,
  } = useScanner();

  const [cameraDenied, setCameraDenied] =
    useState(false);

  return (
    <MainLayout>
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
        className="mx-auto max-w-7xl space-y-8"
      >
        {/* Header */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              QR Scanner
            </h1>

            <p className="mt-2 text-slate-500">
              Scan visitor QR codes for instant Check-In
              and Check-Out.
            </p>

          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-3">

            <div className="flex items-center gap-2">

              <span className="h-3 w-3 animate-pulse rounded-full bg-green-500" />

              <span className="font-medium text-green-700">
                Scanner Ready
              </span>

            </div>

          </div>

        </div>

        {/* Main Content */}

        <div className="grid gap-6 xl:grid-cols-3">

          {/* Camera */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="xl:col-span-2"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-semibold text-slate-800">
                    Live Camera
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Position the QR code inside the frame.
                  </p>

                </div>

                <div className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  LIVE
                </div>

              </div>

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-black">

                {cameraDenied ? (
                  <CameraPermission
                    onRetry={() => {
                      setCameraDenied(false);
                    }}
                  />
                ) : (
                  <>
                    <ScannerCamera
                      key={scannerKey}
                      onScanSuccess={handleScan}
                      onScanError={(error) =>
                        console.error(error)
                      }
                      onPermissionDenied={() =>
                        setCameraDenied(true)
                      }
                    />

                    <ScanOverlay />
                  </>
                )}

              </div>

            </div>
          </motion.div>

          {/* Result */}

          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.3,
            }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">

                <h2 className="text-2xl font-semibold text-slate-800">
                  Scan Result
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Visitor details will appear here after scanning.
                </p>

              </div>

              <div className="min-h-[520px]">

                <ScanResult
                  visitor={visitor}
                  loading={loading}
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  onScanAgain={handleScanAgain}
                />

              </div>

            </div>
          </motion.div>

        </div>

        {/* Success Popup */}

        <ScanSuccess
          open={showSuccess}
          type={successType ?? "checkin"}
          title={
            successType === "checkout"
              ? "Check-Out Successful"
              : "Check-In Successful"
          }
          message={
            successType === "checkout"
              ? "Visitor has been checked out successfully."
              : "Visitor has been checked in successfully."
          }
        />

      </motion.div>
    </MainLayout>
  );
};

export default QRScanner;