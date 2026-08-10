import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaSave,
  FaUser,
  FaIdCard,
  FaCamera,
  FaSearch,
  FaRedo,
} from "react-icons/fa";

import MainLayout from "../../components/layout/MainLayout";

import {
  createVisitor,
  updateVisitor,
  getVisitorById,
  getUsers,
} from "../../services/visitor.service";

import type { User } from "../../types/user";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const ID_PROOF_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "national_id", label: "National ID" },
  { value: "aadhaar", label: "Aadhaar" },
  { value: "pan", label: "PAN" },
  { value: "other", label: "Other" },
];

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_RESIZE_PX = 800;

// ─────────────────────────────────────────────────────────────
// ZOD SCHEMA
// ─────────────────────────────────────────────────────────────

const visitorSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters."),

  // IMPORTANT:
  // Do NOT use .optional() here.
  // This keeps email as `string` instead of `string | undefined`.
  email: z
    .string()
    .email("Enter a valid email address.")
    .or(z.literal("")),

  phone: z
    .string()
    .regex(
      /^[0-9]{10}$/,
      "Phone must be exactly 10 digits."
    ),

  company: z.string().optional(),

  purpose: z
    .string()
    .min(1, "Purpose is required."),

  hostId: z
    .string()
    .min(1, "Host is required."),

  idProofType: z.string().optional(),

  idProofNumber: z.string().optional(),

  faceImage: z.string().optional(),
});

type VisitorFormData = z.infer<typeof visitorSchema>;

// ─────────────────────────────────────────────────────────────
// DEFAULT VALUES
// ─────────────────────────────────────────────────────────────

const DEFAULT_VALUES: VisitorFormData = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  purpose: "",
  hostId: "",
  idProofType: "",
  idProofNumber: "",
  faceImage: "",
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const inputClass = (hasError?: boolean) =>
  [
    "w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition",
    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
    hasError
      ? "border-red-400 bg-red-50"
      : "border-gray-300 bg-white",
  ].join(" ");

// ─────────────────────────────────────────────────────────────
// IMAGE COMPRESSION
// ─────────────────────────────────────────────────────────────

const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();

    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const scale = Math.min(
        1,
        IMAGE_RESIZE_PX /
          Math.max(img.width, img.height)
      );

      const canvas = document.createElement("canvas");

      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      resolve(
        canvas.toDataURL("image/jpeg", 0.8)
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image failed to load"));
    };

    img.src = url;
  });

// ─────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────

const FieldSkeleton = () => (
  <div className="space-y-2">
    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />

    <div className="h-11 w-full bg-gray-200 rounded-lg animate-pulse" />
  </div>
);

const FormSkeleton = () => (
  <div className="max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-8">
    {[1, 2, 3].map((section) => (
      <div key={section} className="space-y-4">
        <div className="h-5 w-40 bg-gray-300 rounded animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldSkeleton />
          <FieldSkeleton />
        </div>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────
// FORM FIELD
// ─────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormField = ({
  label,
  error,
  children,
}: FormFieldProps) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-gray-700">
      {label}
    </label>

    {children}

    {error && (
      <p className="text-sm text-red-500 flex items-center gap-1">
        <span>⚠</span>
        {error}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// FORM SECTION
// ─────────────────────────────────────────────────────────────

interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

const FormSection = ({
  icon,
  title,
  subtitle,
}: FormSectionProps) => (
  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
      {icon}
    </div>

    <div>
      <h2 className="font-semibold text-gray-800">
        {title}
      </h2>

      {subtitle && (
        <p className="text-xs text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// IMAGE UPLOAD
// ─────────────────────────────────────────────────────────────

interface ImageUploadProps {
  value: string | null;
  onChange: (base64: string) => void;
}

const ImageUpload = ({
  value,
  onChange,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate image type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(
        "Only JPG, PNG, or WEBP images are allowed."
      );
      return;
    }

    // Validate image size
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be under 5 MB.");
      return;
    }

    try {
      const compressed = await compressImage(file);

      onChange(compressed);
    } catch {
      toast.error("Failed to process image.");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-start gap-8">
      {/* Preview */}
      <div className="flex-shrink-0 w-28 h-28 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
        {value ? (
          <img
            src={value}
            alt="Visitor preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FaCamera
            size={24}
            className="text-gray-300"
          />
        )}
      </div>

      {/* Upload Controls */}
      <div className="space-y-2 pt-1">
        <label
          htmlFor="faceImageInput"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <FaCamera size={13} />

          {value
            ? "Change Photo"
            : "Upload Photo"}
        </label>

        <input
          ref={inputRef}
          id="faceImageInput"
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handleFile}
        />

        <p className="text-xs text-gray-400">
          JPG, PNG or WEBP · Max 5 MB ·
          Auto-compressed
        </p>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-500 hover:underline"
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// HOST DROPDOWN
// ─────────────────────────────────────────────────────────────

interface HostDropdownProps {
  value: string;
  onChange: (id: string) => void;
  error?: string;
}

const HostDropdown = ({
  value,
  onChange,
  error,
}: HostDropdownProps) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const selected = users.find(
    (user) => user.id === value
  );

  // ─────────────────────────────────────────────
  // LOAD USERS
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);

        console.log("Loading users...");

        const response = await getUsers();

        console.log("API Response:", response);

        if (response.success) {
          console.log("Users:", response.data);

          setUsers(response.data);
        } else {
          console.log(
            "API failed:",
            response
          );

          toast.error(
            response.message ||
              "Failed to load employees."
          );
        }
      } catch (error) {
        console.error(
          "GET USERS ERROR:",
          error
        );

        toast.error(
          "Failed to load employees."
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [open]);

  // ─────────────────────────────────────────────
  // CLOSE WHEN CLICKING OUTSIDE
  // ─────────────────────────────────────────────

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handler
      );
    };
  }, []);

  // ─────────────────────────────────────────────
  // FILTER USERS
  // ─────────────────────────────────────────────

  const normalizedQuery =
    query.toLowerCase().trim();

  const filtered = users.filter((user) =>
    user.name
      .toLowerCase()
      .includes(normalizedQuery) ||
    user.email
      .toLowerCase()
      .includes(normalizedQuery)
  );

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        className={`${inputClass(
          !!error
        )} flex items-center justify-between text-left`}
      >
        <span
          className={
            selected
              ? "text-gray-900"
              : "text-gray-400"
          }
        >
          {selected
            ? selected.name
            : "Search employee…"}
        </span>

        <FaSearch
          size={12}
          className="text-gray-400 flex-shrink-0"
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Search name or email…"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Users */}
          <ul className="max-h-48 overflow-y-auto">
            {loading ? (
              <li className="px-4 py-3 text-sm text-gray-400">
                Loading…
              </li>
            ) : filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400">
                No employees found.
              </li>
            ) : (
              filtered.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(user.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition ${
                      value === user.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="block font-medium">
                      {user.name}
                    </span>

                    <span className="text-xs text-gray-400">
                      {user.email}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE ANIMATION
// ─────────────────────────────────────────────────────────────
// FIX:
// `ease` was inferred as a generic string.
// `as const` keeps it as the literal "easeOut".

const pageVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

const CreateVisitor = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loadingData, setLoadingData] =
    useState(isEditMode);

  // ─────────────────────────────────────────────
  // FORM
  // ─────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<VisitorFormData>({
    resolver: zodResolver(visitorSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // ─────────────────────────────────────────────
  // UNSAVED CHANGES WARNING
  // ─────────────────────────────────────────────

  useEffect(() => {
    const handler = (
      event: BeforeUnloadEvent
    ) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener(
      "beforeunload",
      handler
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handler
      );
    };
  }, [isDirty]);

  // ─────────────────────────────────────────────
  // LOAD VISITOR IN EDIT MODE
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!isEditMode || !id) return;

    const load = async () => {
      try {
        setLoadingData(true);

        const response =
          await getVisitorById(id);

         if (response.success) {
  const visitor = response.data;

  const visitorData = visitor as unknown as {
    hostId?: string;
    host?: {
      id?: string;
    };
  };

  reset({
    fullName: visitor.fullName ?? "",
    email: visitor.email ?? "",
    phone: visitor.phone ?? "",
    company: visitor.company ?? "",
    purpose: visitor.purpose ?? "",

    hostId:
      visitorData.hostId ??
      visitorData.host?.id ??
      "",

    idProofType: visitor.idProofType ?? "",
    idProofNumber: visitor.idProofNumber ?? "",
    faceImage: visitor.faceImage ?? "",
  });

              
        } else {
          toast.error(
            "Visitor not found."
          );

          navigate("/visitors");
        }
      } catch (error) {
        console.error(
          "LOAD VISITOR ERROR:",
          error
        );

        toast.error(
          "Failed to load visitor."
        );

        navigate("/visitors");
      } finally {
        setLoadingData(false);
      }
    };

    void load();
  }, [
    id,
    isEditMode,
    navigate,
    reset,
  ]);

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────

  const onSubmit = async (
    data: VisitorFormData
  ) => {
    try {
      // Normalize optional fields before
      // sending them to the API.
      const submitData = {
        ...data,

        email: data.email ?? "",

        company:
          data.company ?? "",

        idProofType:
          data.idProofType ?? "",

        idProofNumber:
          data.idProofNumber ?? "",

        faceImage:
          data.faceImage ?? "",

        hostId:
          data.hostId ?? "",
      };

      console.log(
        "Submitting visitor:",
        submitData
      );

      const response = isEditMode
        ? await updateVisitor(
            id!,
            submitData
          )
        : await createVisitor(
            submitData
          );

      if (response.success) {
        toast.success(
          isEditMode
            ? "Visitor updated."
            : "Visitor created."
        );

        navigate(
          `/visitors/${response.data.id}`
        );
      } else {
        toast.error(
          response.message ||
            "Operation failed."
        );
      }
    } catch (error: any) {
      console.error(
        "VISITOR SUBMIT ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong."
      );
    }
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────

  return (
    <MainLayout>
      <motion.div
        className="space-y-6"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ─────────────────────────────────────
            HEADER
        ───────────────────────────────────── */}

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode
                ? "Edit Visitor"
                : "Create Visitor"}
            </h1>

            <p className="text-gray-500 mt-1">
              {isEditMode
                ? "Update visitor information"
                : "Register a new visitor to the system"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/visitors")
            }
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition text-sm font-medium"
          >
            <FaArrowLeft size={12} />

            Back
          </button>
        </div>

        {/* ─────────────────────────────────────
            FORM / SKELETON
        ───────────────────────────────────── */}

        {loadingData ? (
          <FormSkeleton />
        ) : (
          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="max-w-5xl bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-10"
          >
            {/* ───────────────────────────────
                SECTION 1
            ─────────────────────────────── */}

            <div className="space-y-6">
              <FormSection
                icon={<FaUser size={14} />}
                title="Personal Information"
                subtitle="Basic contact details"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <FormField
                  label="Full Name *"
                  error={
                    errors.fullName?.message
                  }
                >
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="Jane Smith"
                    className={inputClass(
                      !!errors.fullName
                    )}
                  />
                </FormField>

                {/* Email */}
                <FormField
                  label="Email"
                  error={
                    errors.email?.message
                  }
                >
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="jane@example.com"
                    className={inputClass(
                      !!errors.email
                    )}
                  />
                </FormField>

                {/* Phone */}
                <FormField
                  label="Phone *"
                  error={
                    errors.phone?.message
                  }
                >
                  <input
                    {...register("phone")}
                    type="text"
                    placeholder="10-digit number"
                    maxLength={10}
                    inputMode="numeric"
                    className={inputClass(
                      !!errors.phone
                    )}
                  />
                </FormField>

                {/* Company */}
                <FormField
                  label="Company"
                  error={
                    errors.company?.message
                  }
                >
                  <input
                    {...register("company")}
                    type="text"
                    placeholder="Acme Corp"
                    className={inputClass(
                      !!errors.company
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* ───────────────────────────────
                SECTION 2
            ─────────────────────────────── */}

            <div className="space-y-6">
              <FormSection
                icon={<FaIdCard size={14} />}
                title="Visit Details"
                subtitle="Purpose, host, and ID verification"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Purpose */}
                <div className="md:col-span-2">
                  <FormField
                    label="Purpose *"
                    error={
                      errors.purpose?.message
                    }
                  >
                    <textarea
                      {...register("purpose")}
                      rows={4}
                      placeholder="Describe the reason for the visit…"
                      className={`${inputClass(
                        !!errors.purpose
                      )} resize-none`}
                    />
                  </FormField>
                </div>

                {/* Host */}
                <div className="md:col-span-2">
                  <FormField
                    label="Host *"
                    error={
                      errors.hostId?.message
                    }
                  >
                    <Controller
                      name="hostId"
                      control={control}
                      render={({ field }) => (
                        <HostDropdown
                          value={
                            field.value
                          }
                          onChange={
                            field.onChange
                          }
                          error={
                            errors.hostId
                              ?.message
                          }
                        />
                      )}
                    />
                  </FormField>
                </div>

                {/* ID Proof Type */}
                <FormField
                  label="ID Proof Type"
                  error={
                    errors.idProofType?.message
                  }
                >
                  <select
                    {...register(
                      "idProofType"
                    )}
                    className={inputClass(
                      !!errors.idProofType
                    )}
                  >
                    <option value="">
                      Select type
                    </option>

                    {ID_PROOF_TYPES.map(
                      ({
                        value,
                        label,
                      }) => (
                        <option
                          key={value}
                          value={value}
                        >
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                {/* ID Number */}
                <FormField
                  label="ID Number"
                  error={
                    errors.idProofNumber
                      ?.message
                  }
                >
                  <input
                    {...register(
                      "idProofNumber"
                    )}
                    type="text"
                    placeholder="ID proof number"
                    className={inputClass(
                      !!errors.idProofNumber
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* ───────────────────────────────
                SECTION 3
            ─────────────────────────────── */}

            <div className="space-y-6">
              <FormSection
                icon={<FaCamera size={14} />}
                title="Visitor Photo"
                subtitle="Optional — used on the visitor pass"
              />

              <Controller
                name="faceImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={
                      field.value ?? null
                    }
                    onChange={
                      field.onChange
                    }
                  />
                )}
              />
            </div>

            {/* ───────────────────────────────
                BUTTONS
            ─────────────────────────────── */}

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
              {/* Reset */}
              <button
                type="button"
                onClick={() =>
                  reset(DEFAULT_VALUES)
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition"
              >
                <FaRedo size={11} />

                Reset
              </button>

              {/* Cancel */}
              <button
                type="button"
                onClick={() =>
                  navigate("/visitors")
                }
                className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition"
              >
                Cancel
              </button>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
              >
                <FaSave size={13} />

                {isSubmitting
                  ? "Saving…"
                  : isEditMode
                  ? "Update Visitor"
                  : "Save Visitor"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </MainLayout>
  );
};

// ─────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────

export default CreateVisitor;