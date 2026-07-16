"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  }

  async function uploadFile() {
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    try {
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

        throw new Error(error?.message || "File upload failed");
      }

      const data = await response.json();
      console.log("data:", data);
    } catch (error) {
      console.log("err", error);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label
        htmlFor="file-upload"
        className="
          cursor-pointer
          rounded-lg
          border-2
          border-dashed
          p-8
          text-center
         w-1/2 mx-auto mt-40 mb-10
        "
      >
        <p className="font-medium">Choose PDF or DOCX file</p>

        <p className="text-sm text-gray-500">
          Maximum supported formats: .pdf, .docx
        </p>

        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="flex flex-col justify-center w-fit mx-auto">
          <p>Selected: {file.name}</p>

          <button
            onClick={uploadFile}
            className="
              rounded-md
              bg-amber-500
              px-4 mt-2
              py-2
              text-white
              hover:bg-amber-600
            "
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
