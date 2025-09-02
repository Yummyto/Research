// src/pages/ApproveTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
    FaHome,
    FaWpforms,
    FaRocket,
    FaCalendarCheck,
    FaTimes,
} from "react-icons/fa";
import { Clock, Calendar, User, FileText, CheckCircle } from "lucide-react";

const menuItems = [
    {
        to: "/dashboard",
        icon: <FaHome className="text-blue-400" />,
        label: "Home",
    },
    {
        to: "/dashboard/create-survey",
        icon: <FaWpforms className="text-pink-400" />,
        label: "Create Survey",
    },
    {
        to: "/dashboard/deploy-survey",
        icon: <FaRocket className="text-indigo-400" />,
        label: "Deploy Survey",
    },
    {
        to: "/admin/approve-request",
        icon: <FaCalendarCheck className="text-green-400" />,
        label: "Approved Table",
    },
];

const ApproveTable = () => {
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchApprovedRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5001/api/requests/approved");
            setApprovedRequests(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching approved requests:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovedRequests();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

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
                                                    ? "bg-green-600/20 text-green-400 border border-green-500/30 shadow-md"
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
            <main className="flex-1 transition-all duration-300 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Approved Reservations
                        </h1>
                        <p className="text-slate-300">
                            View all approved document reservation requests
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>{approvedRequests.length} approved requests</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {approvedRequests.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-800 mb-2">
                                    No approved requests
                                </h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    Approved reservations will appear here after processing.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table Header */}
                                <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
                                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        <div className="col-span-1">ID</div>
                                        <div className="col-span-3 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Student Name
                                        </div>
                                        <div className="col-span-3 flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            Document
                                        </div>
                                        <div className="col-span-2 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Date
                                        </div>
                                        <div className="col-span-3 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Time
                                        </div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-slate-700">
                                    {approvedRequests.map((req, index) => (
                                        <div
                                            key={req.id}
                                            className={`px-6 py-4 hover:bg-slate-700 transition-colors ${
                                                index % 2 === 0 ? "bg-slate-800" : "bg-slate-900"
                                            }`}
                                        >
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            #{req.id}
                          </span>
                                                </div>
                                                <div className="col-span-3">
                                                    <div className="text-sm font-medium text-white">
                                                        {req.student_name}
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {req.document_type}
                          </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-sm text-white">
                                                        {formatDate(req.reserved_date)}
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <div className="text-sm text-white font-medium">
                                                        {req.reserved_time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ApproveTable;
