import { useState } from "react";
import {
    User, Mail, Calendar, GraduationCap, Building2, Lock,
    Eye, EyeOff, CheckCircle, AlertCircle
} from "lucide-react";

export default function Signup() {
    const navigate = (path) => window.location.href = path;

    const [form, setForm] = useState({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        birthdate: "",
        year_graduated: "",
        department: "COT",
        password: "",
        confirm_password: "",
        currently_working: "",
        field_of_work: "",
        other_work: "",
        experience: "",
        company_name: ""
    });

    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setMessage("");
        setSuccess(false);

        if (form.password !== form.confirm_password) {
            return setMessage("Passwords do not match!");
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Account created successfully!");
                setSuccess(true);
            } else {
                setMessage(data.error || "Something went wrong.");
            }
        } catch (err) {
            setMessage("Server error. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full mb-4">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-gray-600 mt-2">Join us today and get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                                    name="firstname"
                                    placeholder="First Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                    name="middlename"
                                    placeholder="Middle Name"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                                name="lastname"
                                placeholder="Last Name"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                                name="email"
                                placeholder="Email Address"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Birthdate & Year */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                                    name="birthdate"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                                    name="year_graduated"
                                    placeholder="Year Graduated"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl"
                                name="department"
                                onChange={handleChange}
                            >
                                <option value="COT">College of Technology (COT)</option>
                                <option value="COED">College of Education (COED)</option>
                                <option value="COHTM">College of Hospitality & Tourism Management (COHTM)</option>
                            </select>
                        </div>

                        {/* Currently Working */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-1">Currently Working?</label>
                            <select
                                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl"
                                name="currently_working"
                                value={form.currently_working}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        {/* Field of Work */}
                        {form.currently_working === "Yes" && (
                            <div className="relative">
                                <label className="block text-gray-700 mb-1">Field of Work</label>
                                <select
                                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl"
                                    name="field_of_work"
                                    value={form.field_of_work}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="IT Industry">IT Industry</option>
                                    <option value="BPO Industry">BPO Industry</option>
                                    <option value="Education Industry">Education Industry</option>
                                    <option value="Hotel Industry">Hotel Industry</option>
                                    <option value="Tourism Industry">Tourism Industry</option>
                                    <option value="Management Industry">Management Industry</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="N/A">N/A</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        )}

                        {/* If Others */}
                        {form.field_of_work === "Others" && (
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                    name="other_work"
                                    placeholder="Please specify"
                                    value={form.other_work}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* Years Working */}
                        {form.currently_working === "Yes" && (
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                    name="experience"
                                    placeholder="Years Working"
                                    value={form.experience}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* Company Name */}
                        {form.currently_working === "Yes" && (
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                    name="company_name"
                                    placeholder="Name of the Company (Optional)"
                                    value={form.company_name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl"
                                name="confirm_password"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-3 rounded-xl"
                        >
                            Create Account
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                            {success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <p>{message}</p>
                        </div>
                    )}

                    {success && (
                        <button
                            onClick={() => navigate("/login")}
                            className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-xl"
                        >
                            Back to Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
