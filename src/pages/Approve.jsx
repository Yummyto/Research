// src/pages/Approve.jsx
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
import { Check, X, Clock, Calendar, User, FileText, AlertCircle } from "lucide-react";

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
        to: "/dashboard/approve-table",
        icon: <FaCalendarCheck className="text-green-400" />,
        label: "Approved Table",
    },
];

const Approve = () => {
    const [requests, setRequests] = useState([]);
    const [declineReason, setDeclineReason] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Fetch pending reservations
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5001/api/requests/pending");
            setRequests(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching requests:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Approve handler
    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:5001/api/requests/${id}/approve`);
            fetchRequests();
        } catch (err) {
            console.error("Error approving request:", err);
        }
    };

    // Decline handler
    const handleDecline = async () => {
        if (!selectedRequest || !declineReason.trim()) return;
        try {
            await axios.put(`http://localhost:5001/api/requests/${selectedRequest.id}/decline`, {
                reason: declineReason,
            });
            setDeclineReason("");
            setSelectedRequest(null);
            fetchRequests();
        } catch (err) {
            console.error("Error declining request:", err);
        }
    };

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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
            <main className="flex-1 transition-all duration-300 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Reservation Management
                        </h1>
                        <p className="text-slate-300">
                            Review and manage pending document reservation requests
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{requests.length} pending requests</span>
                        </div>
                    </div>

                    {/* Requests Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {requests.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-800 mb-2">
                                    No pending requests
                                </h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    All reservation requests have been processed. New requests will appear here when submitted.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Table Header */}
                                <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
                                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        <div className="col-span-1">ID</div>
                                        <div className="col-span-2 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Student Name
                                        </div>
                                        <div className="col-span-2 flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            Document
                                        </div>
                                        <div className="col-span-2 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Date
                                        </div>
                                        <div className="col-span-2 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Time
                                        </div>
                                        <div className="col-span-3 text-center">Actions</div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-slate-700">
                                    {requests.map((req, index) => (
                                        <div
                                            key={req.id}
                                            className={`px-6 py-4 hover:bg-slate-700 transition-colors ${
                                                index % 2 === 0 ? "bg-slate-800" : "bg-slate-900"
                                            }`}
                                        >
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            #{req.id}
                          </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-sm font-medium text-white">
                                                        {req.student_name}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {req.document_type}
                          </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-sm text-white">
                                                        {formatDate(req.reserved_date)}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="text-sm text-white font-medium">
                                                        {req.reserved_time}
                                                    </div>
                                                </div>
                                                <div className="col-span-3 flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedRequest(req)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Decline Modal */}
                {selectedRequest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Decline Request
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Request #{selectedRequest.id} - {selectedRequest.student_name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Please select a reason for declining this request:
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm text-black"
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                >
                                    <option value="">-- Select a reason --</option>
                                    <option value="Unfortunately that day is already reserved">
                                        Unfortunately that day is already reserved
                                    </option>
                                    <option value="We are not available that day">
                                        We are not available that day
                                    </option>
                                    <option value="Can you please come for further details">
                                        Can you please come for further details
                                    </option>
                                </select>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedRequest(null);
                                        setDeclineReason("");
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDecline}
                                    disabled={!declineReason}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                                >
                                    Decline Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Approve;
