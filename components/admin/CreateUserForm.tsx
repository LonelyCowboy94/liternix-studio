"use client";

import { createUser } from "@/lib/actions";
import { useState } from "react";
import {
  UserPlus,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  ChevronDown,
  User,
  Mail,
  Lock,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button3D from "../ui/Button3D";

export function CreateUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function action(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await createUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
      router.refresh();
      const form = document.getElementById(
        "create-user-form",
      ) as HTMLFormElement;
      if (form) form.reset();
      setLoading(false);
    }
  }

  return (
    <>
      <Button3D
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2.5 px-4 py-2 transition-all"
      >
        <UserPlus
          size={18}
          className="text-slate-400 group-hover:text-white transition-colors"
        />
        <span className="hidden sm:block text-sm">Add New User</span>
      </Button3D>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* MODAL BOX */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl border border-white/20 max-h-[95vh] overflow-y-auto"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Create Account
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Register a new system member
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* FORM */}
              <form id="create-user-form" action={action} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                      <User size={16} className="text-slate-400" /> Full Name
                    </label>
                    <input
                      name="name"
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                      <Mail size={16} className="text-slate-400" /> Email
                      Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                      <Lock size={16} className="text-slate-400" /> Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      required
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                      <Lock size={16} className="text-slate-400" /> Confirm
                      Password
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Role Select */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                    <Shield size={16} className="text-slate-400" /> System Role
                  </label>
                  <div className="relative max-w-xs">
                    <select
                      name="role"
                      className="w-full appearance-none bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm cursor-pointer"
                    >
                      <option value="USER">Standard User</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl text-sm font-semibold border border-red-100"
                    >
                      <AlertCircle size={18} className="shrink-0" /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-6 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading || success}
                    className={`flex-1 h-13 flex justify-center items-center gap-2 rounded-2xl font-bold transition-all active:scale-[0.98] ${
                      success
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : success ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={20} /> User Created!
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
