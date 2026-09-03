import { useState } from "react";
import { Wrench, Lock, User, AlertCircle } from "lucide-react";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // إرسال مباشر إلى السيرفر عبر axios مع timeout 10 ثوانٍ لعدم التعليق
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          username: formData.username.trim(),
          password: formData.password
        },
        { timeout: 10000 }
      );

      if (res.data && res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // توجيه مباشر للصفحة الرئيسية
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login detail error:", err);
      if (err.code === "ECONNABORTED") {
        setError("انتهت مهلة الاتصال: السيرفر لا يستجيب، تأكد من تشغيل FastAPI.");
      } else if (err.message === "Network Error") {
        setError("تعذر الاتصال بالسيرفر (Network Error): تأكد أن السيرفر يعمل على http://127.0.0.1:8000");
      } else {
        const detail = err.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-800">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-blue-500/30">
            <Wrench size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AutoCore DMS</h1>
          <p className="text-slate-500 text-sm mt-1">سجل الدخول لإدارة مركز الخدمة والعملاء</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">اسم المستخدم</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="admin"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;