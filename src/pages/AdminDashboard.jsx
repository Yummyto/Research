import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaUpload,
  FaUsers,
  FaHome,
  FaFileAlt,
  FaBuilding,
  FaDownload,
  FaEdit,
  FaWpforms,
  FaRocket,
  FaSignOutAlt,
  FaCalendarCheck,
  FaTimes,
} from "react-icons/fa";

const socket = io("http://localhost:5001");

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
    to: "/dashboard/approve-request",
    icon: <FaCalendarCheck className="text-green-400" />,
    label: "Approve Request",
  },
  {
    to: "/login",
    icon: <FaSignOutAlt className="text-red-400" />,
    label: "Logout",
  },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workingSummary, setWorkingSummary] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = () => {
    fetch("http://localhost:5001/api/dashboard/working-summary")
      .then((res) => res.json())
      .then((data) => setWorkingSummary(data))
      .catch((err) => console.error("Working summary error:", err));
  };

  useEffect(() => {
    fetchData();
    socket.on("dataUpdated", () => fetchData());
    return () => socket.disconnect();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a CSV file.");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5001/api/upload/csv", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      alert(result.message);
      socket.emit("csvUploaded");
      setFile(null);
    } catch (error) {
      console.error("CSV upload failed:", error);
      alert("CSV upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 min-h-screen z-50 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:relative lg:z-auto`}
        >
          <div className="min-h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-r border-slate-700/50 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-white">LLCC Connect</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-2">
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          {/* Header */}
          <div className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                >
                  <FaBars size={20} />
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <div className="text-sm text-slate-400">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 lg:p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {["COT", "COED", "COHTM"].map((dept) => {
                const found = workingSummary.find(
                  (item) => item.Department === dept
                );
                const colors = {
                  COT: "from-emerald-500 to-emerald-600",
                  COED: "from-purple-500 to-purple-600",
                  COHTM: "from-rose-500 to-rose-600",
                };
                return (
                  <div
                    key={dept}
                    className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 shadow-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300 -translate-y-16 translate-x-16 rounded-full"></div>
                    <div className="relative z-10">
                      <div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colors[dept]} shadow-lg mb-4`}
                      >
                        <FaUsers className="text-white text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-300 mb-2">
                        {dept}
                      </h3>
                      <p className="text-4xl font-bold text-white mb-1">
                        {found ? found.count : 0}
                      </p>
                      <p className="text-sm text-slate-400">Working Graduates</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CSV Upload Section */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-xl border border-slate-600/30 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                  <FaUpload className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Upload Graduate Student Data
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Upload CSV files to update graduate student data
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Select CSV file..."
                  />
                  {file && (
                    <div className="mt-2 text-sm text-emerald-400 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      {file.name} selected
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!file || uploading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaUpload />
                      Upload CSV
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
