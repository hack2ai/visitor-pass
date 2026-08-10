import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

import type { Visitor } from "../types/visitor";

import {
  scanVisitor,
  checkInVisitor,
  checkOutVisitor,
} from "../services/scanner.service";

type SuccessType = "checkin" | "checkout" | null;

export const useScanner = () => {
  const [visitor, setVisitor] = useState<Visitor | null>(null);

  const [loading, setLoading] = useState(false);

  const [scannerKey, setScannerKey] = useState(0);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [successType, setSuccessType] =
    useState<SuccessType>(null);

  /**
   * Prevent duplicate scans
   */
  const scanningRef = useRef(false);

  /**
   * ==========================================
   * RESET SCANNER
   * ==========================================
   */
  const resetScanner = () => {
    setVisitor(null);

    setScannerKey((prev) => prev + 1);

    scanningRef.current = false;
  };

  /**
   * ==========================================
   * SHOW SUCCESS
   * ==========================================
   */
  const showSuccessPopup = (
    type: SuccessType
  ) => {
    setSuccessType(type);

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);

      resetScanner();

      toast.success("Scanner Ready");
    }, 2500);
  };

  /**
   * ==========================================
   * SCAN QR
   * ==========================================
   */
  const handleScan = async (
    visitorId: string
  ) => {
    if (scanningRef.current) return;

    scanningRef.current = true;

    try {
      setLoading(true);

      const response = await scanVisitor(
        visitorId
      );

      if (response.success) {
        setVisitor(response.data);

        toast.success("Visitor Found");
      } else {
        scanningRef.current = false;

        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);

      scanningRef.current = false;

      toast.error("Invalid QR Code");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ==========================================
   * CHECK IN
   * ==========================================
   */
  const handleCheckIn = async () => {
    if (!visitor) return;

    try {
      setLoading(true);

      const response =
        await checkInVisitor(visitor.id);

      if (response.success) {
        setVisitor(response.data);

        toast.success(
          "Visitor Checked In Successfully"
        );

        showSuccessPopup("checkin");
      }
    } catch (error) {
      console.error(error);

      toast.error("Check-In Failed");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ==========================================
   * CHECK OUT
   * ==========================================
   */
  const handleCheckOut = async () => {
    if (!visitor) return;

    try {
      setLoading(true);

      const response =
        await checkOutVisitor(visitor.id);

      if (response.success) {
        setVisitor(response.data);

        toast.success(
          "Visitor Checked Out Successfully"
        );

        showSuccessPopup("checkout");
      }
    } catch (error) {
      console.error(error);

      toast.error("Check-Out Failed");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ==========================================
   * SCAN AGAIN
   * ==========================================
   */
  const handleScanAgain = () => {
    resetScanner();

    toast("Scanner Ready");
  };

  return {
    visitor,
    loading,
    scannerKey,

    showSuccess,
    successType,

    handleScan,
    handleCheckIn,
    handleCheckOut,
    handleScanAgain,
  };
};