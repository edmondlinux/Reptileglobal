import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import LoadingSpinner from "./LoadingSpinner";

const KYCVerificationForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idImage: null,
    reptileImage: null,
  });

  const [previews, setPreviews] = useState({
    idImage: null,
    reptileImage: null,
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const idImageRef = useRef();
  const reptileImageRef = useRef();

  // File validation
  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPG, JPEG, or PNG)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  // Handle file selection
  const handleFileChange = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setErrors(prev => ({ ...prev, [type]: validationError }));
      return;
    }

    setFormData(prev => ({ ...prev, [type]: file }));
    setErrors(prev => ({ ...prev, [type]: null }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews(prev => ({ ...prev, [type]: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Remove selected file
  const removeFile = (type) => {
    setFormData(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
    setErrors(prev => ({ ...prev, [type]: null }));

    if (type === 'idImage') {
      idImageRef.current.value = '';
    } else {
      reptileImageRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.idImage || !formData.reptileImage) {
      setErrors({ submit: "Please upload both required images" });
      return;
    }

    setUploading(true);
    setErrors({});

    try {
      // Upload both images to Cloudinary
      const [idImageResult, reptileImageResult] = await Promise.all([
        uploadToCloudinary(formData.idImage),
        uploadToCloudinary(formData.reptileImage)
      ]);

      if (!idImageResult.success || !reptileImageResult.success) {
        throw new Error("Failed to upload images");
      }

      // Submit KYC data to backend
      const response = await axios.post("/kyc/submit", {
        token,
        idImageUrl: idImageResult.url,
        reptileImageUrl: reptileImageResult.url
      });

      if (response.data.success) {
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.error("KYC submission error:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to submit verification. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900">Verification Submitted</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Your KYC verification has been submitted successfully. You will be notified once it's reviewed.
              </p>
              <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                <p className="text-sm text-emerald-700 font-medium">
                  We'll review your documents within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              KYC Verification
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To complete your shipment verification, please upload the following documents, We require this information to ensure the safety and security of our customers and to also make sure that shipments are transported to the accurate person & location.
            </p>
            
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ID Image Upload */}
            <div className="group">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Government-issued ID (Front)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50/30 group-hover:shadow-lg">
                  {previews.idImage ? (
                    <div className="relative">
                      <img
                        src={previews.idImage}
                        alt="ID Preview"
                        className="max-w-full h-56 object-contain mx-auto rounded-xl shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('idImage')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-emerald-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Click to upload your ID</p>
                      <p className="text-sm text-gray-500">Or drag and drop your file here</p>
                    </div>
                  )}
                  <input
                    ref={idImageRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => handleFileChange('idImage', e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              {errors.idImage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{errors.idImage}</p>
                </div>
              )}
            </div>

            {/* Reptile Image Upload */}
            <div className="group">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Photo of yourself with the reptile
                <span className="text-red-500 ml-1">*</span> 
                <p className="text-gray-600 text-lg leading-relaxed">
                  Upload a clear and well lit image of yourself holding a reptile e.g. a snake, lizard etc infront of it's enclosure. This is to help us verify that its really you and not someone else.
                </p>
                
              </label>
              <div className="relative">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-50/30 group-hover:shadow-lg">
                  {previews.reptileImage ? (
                    <div className="relative">
                      <img
                        src={previews.reptileImage}
                        alt="Reptile Preview"
                        className="max-w-full h-56 object-contain mx-auto rounded-xl shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('reptileImage')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-emerald-600" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-2">Click to upload photo with reptile</p>
                      <p className="text-sm text-gray-500">Or drag and drop your file here</p>
                    </div>
                  )}
                  <input
                    ref={reptileImageRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => handleFileChange('reptileImage', e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              {errors.reptileImage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{errors.reptileImage}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              {errors.submit && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{errors.submit}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={uploading || !formData.idImage || !formData.reptileImage}
                className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg group"
              >
                <div className="flex items-center justify-center">
                  {uploading ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-3 text-lg">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-lg">Submit Verification</span>
                    </>
                  )}
                </div>
                {!uploading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                )}
              </button>
            </div>
          </form>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-700">Important Information:</p>
                <p>• Supported formats: JPG, JPEG, PNG</p>
                <p>• Maximum file size: 10MB per image</p>
                <p>• Your data is securely processed and stored</p>
                <p>• Verification typically takes 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerificationForm;