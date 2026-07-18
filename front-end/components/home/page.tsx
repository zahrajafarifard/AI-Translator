"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  UploadCloud,
  FileText,
  Loader2,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

type Toast = {
  message: string;
  type: "success" | "error";
};

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  function showToast(message: string, type: Toast["type"]) {
    setToast({ message, type });
  }

  if (status === "loading") {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const fileName = selectedFile.name.toLowerCase();

    const isValid = allowedExtensions.some((extension) =>
      fileName.endsWith(extension),
    );

    if (!isValid) {
      setFile(null);
      showToast("Please choose a PDF, DOC, or DOCX file.", "error");
      event.target.value = "";

      return;
    }

    setFile(selectedFile);
  }

  async function uploadFile() {
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/documents/translate`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${session?.backendToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed.");
      }

      await response.json();

      showToast("Queued successfully. We'll email you when ready.", "success");

      setFile(null);
    } catch (err) {
      console.error(err);

      showToast(
        err instanceof Error ? err.message : "Unable to upload the document.",
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-16">
      {toast && (
        <div
          className={`
            fixed top-6 right-6 z-50
            flex w-full max-w-sm items-start gap-3
            rounded-2xl
            border
            px-5 py-4
            shadow-xl
            transition-all
            animate-in slide-in-from-top-4 duration-300
            ${
              toast.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }
          `}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />
          ) : (
            <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
          )}

          <div className="flex-1">
            <p
              className={`font-medium ${
                toast.type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {toast.type === "success" ? "Success" : "Error"}
            </p>

            <p
              className={`mt-1 text-sm ${
                toast.type === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => setToast(null)}
            className="rounded-md p-1 text-slate-500 transition hover:bg-white hover:text-slate-700"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          AI Document Translator
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Translate <span className="font-bold text-gray-700">English</span>
          documents into
          <span className="font-bold text-gray-700">Persian</span> using local
          AI. Formatting and layout are preserved for DOC and DOCX files.
        </p>
      </div>

      <label
        htmlFor="file-upload"
        className="
          w-full
          cursor-pointer
          rounded-3xl
          border-2
          border-dashed
          border-slate-300
          bg-slate-50
          p-12
          text-center
          transition
          hover:border-blue-500
          hover:bg-blue-50
        "
      >
        <UploadCloud className="mx-auto mb-6 h-14 w-14 text-blue-600" />

        <h2 className="text-xl font-semibold text-slate-900">
          Upload your document
        </h2>

        <p className="mt-2 text-slate-500">
          Drag and drop your file here or click to browse.
        </p>

        <p className="mt-4 text-sm text-slate-400">Supports PDF and DOCX</p>

        <input
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-100 p-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <p className="font-medium text-slate-900">{file.name}</p>

                <p className="text-sm text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              onClick={uploadFile}
              disabled={!file || isUploading}
              className="
              flex items-center gap-2
              rounded-xl
              bg-blue-600
              px-6 py-3
              font-medium
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:bg-slate-300
              disabled:text-slate-500 "
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate Document"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 grid w-full gap-4 md:grid-cols-2">
        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <ShieldCheck className="mt-1 h-6 w-7 text-green-600" />

          <div>
            <h3 className="font-semibold text-slate-900">Privacy First</h3>

            <p className="mt-1 text-sm text-slate-600">
              Your documents are translated locally and are never sent to
              external AI services.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <Cpu className="mt-1 h-7 w-7 text-blue-600" />

          <div>
            <h3 className="font-semibold text-slate-900">Local AI</h3>

            <p className="mt-1 text-sm text-slate-600">
              Powered by TranslateGemma running locally for secure, high-quality
              English to Persian translation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
