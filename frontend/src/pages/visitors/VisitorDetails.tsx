import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaClipboardList,
  FaUserTie,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaQrcode,
  FaDownload,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

import MainLayout from "../../components/layout/MainLayout";

import {
  getVisitorById,
  deleteVisitor,
  updateVisitorStatus,
  downloadVisitorPass,
} from "../../services/visitor.service";

import type { Visitor, VisitorStatus } from "../../types/visitor";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// ─── StatusBadge ────────────────────────────────────────────────────────────

const badgeColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CHECKED_IN":
      return "bg-blue-100 text-blue-700";
    case "CHECKED_OUT":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-red-100 text-red-700";
  }
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "lg";
}

const StatusBadge = ({ status, size = "sm" }: StatusBadgeProps) => {
  const sizeClass = size === "lg" ? "px-6 py-3 text-lg" : "px-5 py-2 text-sm";
  return (
    <span className={`rounded-full font-bold ${sizeClass} ${badgeColor(status)}`}>
      {status}
    </span>
  );
};

// ─── VisitorDetails ──────────────────────────────────────────────────────────

const VisitorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<VisitorStatus | null>(null);

  useEffect(() => {
    const loadVisitor = async () => {
      try {
        if (!id) return;
        const response = await getVisitorById(id);
        if (response.success) {
          setVisitor(response.data);
        } else {
          setError("Visitor not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load visitor");
      } finally {
        setLoading(false);
      }
    };
    void loadVisitor();
  }, [id]);

  const handleDelete = async () => {
    if (!visitor) return;
    try {
      setDeleteLoading(true);
      const response = await deleteVisitor(visitor.id);
      if (response.success) {
        toast.success("Visitor deleted successfully.");
        navigate("/visitors");
      } else {
        toast.error(response.message || "Failed to delete visitor.");
      }
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message ?? "Failed to delete visitor.";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!visitor || !selectedStatus) return;
    try {
      setStatusLoading(true);
      const response = await updateVisitorStatus(visitor.id, selectedStatus);
      if (response.success) {
        setVisitor(response.data);
        setShowStatusModal(false);
        setSelectedStatus(null);
        toast.success("Visitor status updated successfully.");
      } else {
        toast.error(response.message || "Failed to update visitor status.");
      }
    } catch (error: any) {
      console.error(error);
      const message = error?.response?.data?.message ?? "Failed to update visitor status.";
      toast.error(message);
    } finally {
      setStatusLoading(false);
    }
  };

  const openStatusModal = (status: VisitorStatus) => {
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedStatus(null);
  };

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);
  const handleEdit = () => navigate(`/visitors/edit/${visitor?.id}`);

  const getStatusTitle = () => {
    switch (selectedStatus) {
      case "APPROVED":   return "Approve Visitor";
      case "REJECTED":   return "Reject Visitor";
      case "CHECKED_IN": return "Check In Visitor";
      case "CHECKED_OUT":return "Check Out Visitor";
      default:           return "Update Visitor Status";
    }
  };

  const getStatusButtonText = () => {
    switch (selectedStatus) {
      case "APPROVED":   return "Approve";
      case "REJECTED":   return "Reject";
      case "CHECKED_IN": return "Check-In";
      case "CHECKED_OUT":return "Check-Out";
      default:           return "Update";
    }
  };

  const handleDownloadVisitorPass = async () => {
    if (!visitor) return;
    try {
      setDownloadLoading(true);
      const blob = await downloadVisitorPass(visitor.id);
      saveAs(blob, `${visitor.fullName.replace(/\s+/g, "_")}_Visitor_Pass.pdf`);
      toast.success("Visitor pass downloaded.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download visitor pass.");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadQRCode = () => {
    if (!visitor?.qrCode) return;
    const link = document.createElement("a");
    link.href = `${API_URL}${visitor.qrCode}`;
    link.download = `${visitor.fullName.replace(/\s+/g, "_")}_QR_Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded.");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96 text-xl font-semibold">
          Loading Visitor...
        </div>
      </MainLayout>
    );
  }

  if (error || !visitor) {
    return (
      <MainLayout>
        <div className="bg-red-100 border border-red-300 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-red-700">{error}</h2>
          <button
            onClick={() => navigate("/visitors")}
            className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            Back
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: { style: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d" } },
          error:   { style: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" } },
        }}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/visitors")}
              className="w-11 h-11 rounded-lg bg-slate-800 text-white flex items-center justify-center hover:bg-slate-900 transition"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Visitor Details</h1>
              <p className="text-gray-500">Complete visitor information</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {visitor.status === "PENDING" && (
              <>
                <button
                  onClick={() => openStatusModal("APPROVED")}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
                >
                  <FaCheckCircle /> Approve
                </button>
                <button
                  onClick={() => openStatusModal("REJECTED")}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
                >
                  <FaTimesCircle /> Reject
                </button>
              </>
            )}
            {visitor.status === "APPROVED" && (
              <button
                onClick={() => openStatusModal("CHECKED_IN")}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <FaSignInAlt /> Check-In
              </button>
            )}
            {visitor.status === "CHECKED_IN" && (
              <button
                onClick={() => openStatusModal("CHECKED_OUT")}
                className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2"
              >
                <FaSignOutAlt /> Check-Out
              </button>
            )}
            <button
              onClick={handleEdit}
              className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={openDeleteModal}
              className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>

        {/* Visitor Card */}
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <div>
                <h2 className="text-4xl font-bold">{visitor.fullName}</h2>
                <p className="opacity-90 mt-2">Visitor ID : {visitor.id}</p>
              </div>
              <div>
                <StatusBadge status={visitor.status} />
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Personal Information */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaUser /> Personal Information
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <FaEnvelope className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="font-semibold">{visitor.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaPhone className="text-green-600 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="font-semibold">{visitor.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaBuilding className="text-purple-600 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Company</p>
                    <p className="font-semibold">{visitor.company || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Information */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaClipboardList /> Visit Information
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <FaUserTie className="text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Host</p>
                    <p className="font-semibold">{visitor.hostName}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaClipboardList className="text-indigo-600 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Purpose</p>
                    <p className="font-semibold">{visitor.purpose}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaCalendarAlt className="text-red-600 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Created On</p>
                    <p className="font-semibold">
                      {new Date(visitor.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8 pb-8">
            {/* ID Proof Card */}
            <div className="bg-blue-50 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-700 mb-5">ID Proof</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Proof Type</p>
                  <p className="font-semibold text-lg">{visitor.idProofType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Proof Number</p>
                  <p className="font-semibold text-lg break-all">{visitor.idProofNumber || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Visitor Status Card */}
            <div className="bg-green-50 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-green-700 mb-5">Current Status</h3>
              <div className="flex justify-center mt-10">
                <StatusBadge status={visitor.status} size="lg" />
              </div>
            </div>

            {/* QR Code Card */}
            <div className="bg-purple-50 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-purple-700 mb-6 flex items-center gap-2">
                <FaQrcode /> Visitor QR Code
              </h3>
              {visitor.qrCode ? (
                <div className="space-y-5">
                  <div className="flex justify-center">
                    <img
                      src={`${API_URL}${visitor.qrCode}`}
                      alt="Visitor QR"
                      className="w-56 h-56 rounded-xl border-4 border-white shadow-lg bg-white p-3 object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <a
                      href={`${API_URL}${visitor.qrCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white rounded-lg py-3 text-center hover:bg-blue-700 transition"
                    >
                      Open QR
                    </a>
                    <button
                      onClick={handleDownloadQRCode}
                      className="bg-green-600 text-white rounded-lg py-3 hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <FaDownload /> Download QR
                    </button>
                    <button
                      onClick={handleDownloadVisitorPass}
                      disabled={downloadLoading}
                      className="bg-indigo-600 text-white rounded-lg py-3 hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {downloadLoading ? (
                        <><FaSpinner className="animate-spin" /> Downloading...</>
                      ) : (
                        <><FaDownload /> Download Visitor Pass</>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-72 text-gray-500">
                  <FaQrcode className="text-7xl mb-4 opacity-40" />
                  <p className="font-medium">QR Code Not Generated</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Delete Visitor</h2>
                <button
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}
                  className="text-white/80 hover:text-white transition"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-7">
                  Are you sure you want to delete
                  <span className="font-bold"> {visitor.fullName}</span>?
                </p>
                <p className="mt-2 text-red-500 text-sm">This action cannot be undone.</p>
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={closeDeleteModal}
                    disabled={deleteLoading}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleteLoading ? (
                      <><FaSpinner className="inline mr-2 animate-spin" /> Deleting...</>
                    ) : (
                      "Delete Visitor"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{getStatusTitle()}</h2>
                <button
                  onClick={closeStatusModal}
                  disabled={statusLoading}
                  className="text-white/80 hover:text-white transition"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-7">
                  Are you sure you want to
                  <span className="font-bold"> {getStatusButtonText()}</span>
                  <span className="font-bold"> {visitor.fullName}</span>?
                </p>
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={closeStatusModal}
                    disabled={statusLoading}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={statusLoading}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {statusLoading ? (
                      <><FaSpinner className="inline mr-2 animate-spin" /> Updating...</>
                    ) : (
                      getStatusButtonText()
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default VisitorDetails;