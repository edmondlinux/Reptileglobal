
import { useParams } from "react-router-dom";
import KYCVerificationForm from "../components/KYCVerificationForm";

const KYCVerificationPage = () => {
  const { token } = useParams();

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Invalid Link</h3>
            <p className="mt-1 text-sm text-gray-500">
              This verification link is invalid or malformed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <KYCVerificationForm />;
};

export default KYCVerificationPage;
