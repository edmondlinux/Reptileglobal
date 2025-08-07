
import { useState } from "react";
import axios from "../lib/axios";

const KYCMagicLinkGenerator = ({ shipment, onClose }) => {
  const [generating, setGenerating] = useState(false);
  const [magicLink, setMagicLink] = useState("");
  const [error, setError] = useState("");

  const generateLink = async () => {
    setGenerating(true);
    setError("");
    
    try {
      const response = await axios.post("/kyc/generate-magic-link", {
        shipmentId: shipment._id,
        userEmail: shipment.recipient.email,
        userName: shipment.recipient.name
      });

      if (response.data.success) {
        setMagicLink(response.data.magicLink);
      }
    } catch (error) {
      console.error("Error generating magic link:", error);
      setError(error.response?.data?.message || "Failed to generate magic link");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(magicLink);
      // You could add a toast notification here
      alert("Magic link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Generate KYC Magic Link</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Tracking:</strong> {shipment.trackingNumber}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Recipient:</strong> {shipment.recipient.name}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Email:</strong> {shipment.recipient.email}
            </p>
          </div>

          {!magicLink ? (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Generate a one-time magic link for KYC verification
              </p>
              <button
                onClick={generateLink}
                disabled={generating}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? "Generating..." : "Generate Magic Link"}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-700 mb-2">Magic Link Generated:</p>
              <div className="bg-gray-100 p-3 rounded border">
                <p className="text-xs break-all">{magicLink}</p>
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Copy Link
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCMagicLinkGenerator;
