import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginAPI, registerAPI } from '../services/api';
import toast from 'react-hot-toast';
import { GraduationCap, Sparkles } from 'lucide-react';
import Button from '../components/shared/Button';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(isLogin ? "Signing in..." : "Creating profile...");

    try {
      const res = isLogin ? await loginAPI(formData) : await registerAPI(formData);
      login(res.data);
      toast.success(`Welcome back, ${res.data.username}!`, { id: loadingToast });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", { id: loadingToast });
    }
  };

  return (
    <div className="dark min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-brand-accent/10 p-4 rounded-2xl mb-4">
            <GraduationCap className="text-brand-accent" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white">MasteryPath</h1>
          <p className="text-slate-400 text-sm mt-2">
            {isLogin ? "Elevate your learning journey" : "Join the elite student circle"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Username</label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full py-4 mt-4">
            <Sparkles size={18} />
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-sm text-slate-500 hover:text-brand-accent transition"
        >
          {isLogin ? "Don't have a profile? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}