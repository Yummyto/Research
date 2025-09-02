// llcc/src/pages/DeploySurvey.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
  FaRocket,
  FaCheck,
  FaPlay,
  FaListUl,
  FaClipboardCheck,
  FaBars,
  FaTimes,
  FaHome,
  FaFileAlt,
  FaBuilding,
  FaDownload,
  FaEdit,
  FaWpforms,
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
    icon: <FaFileAlt className="text-emerald-400" />,
    label: "COT Report",
  },
  {
    to: "/admin/reports/coed",
    icon: <FaFileAlt className="text-purple-400" />,
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
    icon: <FaEdit className="text-amber-400" />,
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

export default function DeploySurvey() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/dashboard/surveys"
      );
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching survey questions:", err);
      setMessage("Failed to load survey questions");
    }
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((q) => q !== id));
    } else {
      if (selected.length >= 10) {
        setMessage("You can only select up to 10 questions");
        return;
      }
      setSelected([...selected, id]);
    }
  };

  const deploySurvey = async () => {
    if (selected.length === 0) {
      setMessage("Please select at least one question to deploy");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/dashboard/deploy-survey",
        {
          questionIds: selected,
        }
      );
      setMessage(res.data.message);
      setSelected([]);
    } catch (err) {
      console.error("Error deploying survey:", err);
      setMessage(err.response?.data?.message || "Failed to deploy survey");
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
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
                <FaRocket className="text-white text-3xl" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Deploy Survey
              </h1>
              <p className="text-slate-400 text-lg">
                Select up to 10 questions to deploy to students
              </p>
            </div>

            {/* Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-xl border border-slate-600/30 p-6 lg:p-8">
              {/* Selection Summary */}
              <div className="flex items-center justify-between mb-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <FaClipboardCheck className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Selected Questions</p>
                    <p className="text-sm text-slate-400">
                      {selected.length} of 10 questions selected
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={deploySurvey}
                    disabled={selected.length === 0 || loading}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Deploying...
                      </>
                    ) : (
                      <>
                        <FaPlay />
                        Deploy Survey
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                    <FaListUl className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Available Questions
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <FaListUl className="text-4xl mx-auto mb-3 opacity-50" />
                      <p>No survey questions available</p>
                      <p className="text-sm">
                        Create some questions first to deploy a survey
                      </p>
                    </div>
                  ) : (
                    questions.map((q) => (
                      <div
                        key={q.id}
                        className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          selected.includes(q.id)
                            ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-lg"
                            : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50"
                        }`}
                        onClick={() => toggleSelect(q.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              selected.includes(q.id)
                                ? "bg-indigo-500 border-indigo-500"
                                : "border-slate-400 group-hover:border-indigo-400"
                            }`}
                          >
                            {selected.includes(q.id) && (
                              <FaCheck className="text-white text-xs" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium leading-relaxed">
                              {q.question}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                              <span className="px-2 py-1 bg-slate-600/50 rounded-full">
                                ID: {q.id}
                              </span>
                              {q.created_at && (
                                <span className="px-2 py-1 bg-slate-600/50 rounded-full">
                                  {new Date(q.created_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`mt-6 p-4 rounded-xl text-sm ${
                    message.includes("deployed") || message.includes("success")
                      ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/20 border border-red-500/30 text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Help Section */}
              <div className="mt-6 p-4 bg-slate-700/20 rounded-xl border border-slate-600/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-600/50">
                    <FaClipboardCheck className="text-slate-400" />
                  </div>
                  <div className="text-sm text-slate-400">
                    <p className="font-medium text-slate-300 mb-1">
                      How to deploy a survey:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Select up to 10 questions from the list above</li>
                      <li>Click the "Deploy Survey" button</li>
                      <li>
                        The selected questions will be made available to
                        students
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
