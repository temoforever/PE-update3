import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold">404 - الصفحة غير موجودة</h1>
      <p className="text-lg mt-4">عذرًا، الصفحة التي تبحث عنها غير متوفرة.</p>
      <Link
        to="/login"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        العودة إلى تسجيل الدخول
      </Link>
    </div>
  );
}

export default NotFound;
