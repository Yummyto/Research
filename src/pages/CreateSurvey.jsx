// src/pages/CreateSurvey.jsx
import React, { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaFileAlt,
  FaEdit,
  FaBars,
  FaTimes,
  FaHome,
  FaFileAlt as FaFileAltIcon,
  FaBuilding,
  FaDownload,
  FaEdit as FaEditIcon,
  FaWpforms,
  FaRocket,
  FaSignOutAlt,
  FaCalendarCheck,
} from "react-icons/fa";

const menuItems = [
  {
    to: "/dashboard",
    icon: <FaHome className="text-blue-400" />,
    label: "Home",
  },
  {
    to: "/admin/reports/cot",
    icon: <FaFileAltIcon className="text-emerald-400" />,
    label: "COT Report",
  },
  {
    to: "/admin/reports/coed",
    icon: <FaFileAltIcon className="text-purple-400" />,
    label: "COED Report",
  },
  {
    to: "/admin/reports/cohtm",
    icon: <FaBuilding className="text-rose-400" />,
    label: "COHTM Report",
  },
  {
    to: "/admin/download",
    icon: <FaDownload className="text-cyan-400" />,
    label: "Download Data",
  },
  {
    to: "/admin/edit-students",
    icon: <FaEditIcon className="text-amber-400" />,
    label: "Edit Students",
  },
  {
    to: "/dashboard/create-survey",
    icon: <FaWpforms className="text-pink-400" />,
    label: "Create Survey Form",
  },
  {
    to: "/dashboard/deploy-survey",
    icon: <FaRocket className="text-indigo-400" />,
    label: "Deploy Surveys",
  },
  {
    to: "/admin/approve-request",
    icon: <FaCalendarCheck className="text-green-400" />,
    label: "Approve Request",
  },
  {
    to: "/login",
    icon: <FaSignOutAlt className="text-red-400" />,
    label: "Logout",
  },
];

export default function CreateSurvey() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([""]); // start with 1 question
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleQuestionChange = (index, value) => {
    const copy = [...questions];
    copy[index] = value;
    setQuestions(copy);
  };

  const addQuestion = () => {
    if (questions.length >= 10) {
      setMessage("You can only add up to 10 questions.");
      return;
    }
    setQuestions([...questions, ""]);
    setMessage("");
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    const copy = questions.filter((_, i) => i !== index);
    setQuestions(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const trimmed = questions
      .map((q) => (q || "").trim())
      .filter((q) => q.length > 0);

    if (trimmed.length === 0) {
      setMessage("Please add at least one question.");
      return;
    }
    if (trimmed.length > 10) {
      setMessage("Maximum 10 questions allowed.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        questions: trimmed,
        metadata: {
          title: title.trim() || null,
          description: description.trim() || null,
        },
      };

      const res = await axios.post(
        "http://localhost:5001/api/dashboard/create-survey",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(res.data.message || "Survey created");
      setTitle("");
      setDescription("");
      setQuestions([""]);
    } catch (err) {
      console.error("Create survey error:", err);
      setMessage(err.response?.data?.message || "Failed to create survey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
      {/* Sidebar */}
      <>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 min-h-screen z-50 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:relative lg:z-auto`}
        >
          <div className="min-h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-r border-slate-700/50 flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-2 overflow-y-auto">
              <nav className="flex flex-col gap-0.5">
                {menuItems.map(({ to, icon, label }) => (
                  <NavLink
                    key={label}
                    to={to}
                    onClick={() =>
                      window.innerWidth < 1024 && setSidebarOpen(false)
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-sm"
                      }`
                    }
                  >
                    <span className="group-hover:scale-105 transition-transform duration-200">
                      {icon}
                    </span>
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-2 border-t border-slate-700/50">
              <div className="text-center text-xs text-slate-500">
                <p>LLCC Admin System</p>
                <p className="mt-0">v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300">
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg mb-4">
                <FaFileAlt className="text-white text-3xl" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Create New Survey
              </h1>
              <p className="text-slate-400 text-lg">
                Build surveys with up to 10 questions
              </p>
            </div>

            {/* Form */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-xl border border-slate-600/30 p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title and Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Survey Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter survey title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Enter survey description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Questions Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                      <FaEdit className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      Survey Questions
                    </h3>
                    <span className="ml-auto text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
                      {questions.length}/10
                    </span>
                  </div>

                  {questions.map((q, idx) => (
                    <div key={idx} className="group relative">
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-white font-semibold text-sm border border-slate-500/50">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder={`Question ${idx + 1}...`}
                            value={q}
                            onChange={(e) =>
                              handleQuestionChange(idx, e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                          />
                        </div>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(idx)}
                            className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white transition-all duration-200 hover:shadow-lg opacity-0 group-hover:opacity-100"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={addQuestion}
                      disabled={questions.length >= 10}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaPlus size={16} />
                      Add Question
                    </button>
                    <span className="text-slate-400 text-sm self-center">
                      Maximum 10 questions allowed
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Survey...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <FaSave />
                        Create Survey
                      </div>
                    )}
                  </button>
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`mt-4 p-4 rounded-xl text-sm ${
                      message.includes("created") || message.includes("success")
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                        : "bg-red-500/20 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
