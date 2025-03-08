import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DeleteAccountConfirmation = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Clear all storage to ensure the user is completely logged out
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-green-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-bold mb-4">تم حذف الحساب بنجاح</h1>
        <p className="text-gray-600 mb-6">
          تم حذف حسابك وجميع بياناتك بشكل نهائي من النظام.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-[#7C9D32] hover:bg-[#7C9D32]/90 text-white font-bold py-2 px-6"
        >
          العودة للصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccountConfirmation;
