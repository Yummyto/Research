import { useState, useEffect } from "react";
import axios from "axios";

function api() {
  return axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}

export default function Home() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    document_type: "",
    reserved_date: "",
    reserved_time: "",
  });

  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [surveyAnswers, setSurveyAnswers] = useState({});

  const [myReservations, setMyReservations] = useState([]);

  useEffect(() => {
    fetchDocumentTypes();
    fetchMyReservations();
    fetchSurveyQuestions();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/documents/types");
      setTypes(res.data.types || []);
    } catch (err) {
      console.error("Error loading document types:", err);
    }
  };

  const fetchMyReservations = async () => {
    try {
      const res = await api().get("/documents/my");
      setMyReservations(res.data || []);
    } catch (err) {
      console.error("Error loading reservations:", err);
    }
  };

  const fetchSurveyQuestions = async () => {
    try {
      const res = await api().get("/dashboard/active-survey");
      setSurveyQuestions(res.data || []);
    } catch (err) {
      console.error("Error loading survey questions:", err);
    }
  };

  const onReserve = (e) => {
    e.preventDefault();
    if (!form.document_type || !form.reserved_date || !form.reserved_time) {
      alert("Please complete all fields before proceeding.");
      return;
    }
    setShowSurvey(true);
  };

  const submitReservation = async () => {
    try {
      // Map answers to q1..q10 fields
      const surveyData = {};
      for (let i = 1; i <= 10; i++) {
        const question = surveyQuestions[i - 1];
        surveyData[`q${i}`] = question ? surveyAnswers[question.id] || "" : "";
      }

      await api().post("/documents/reserve", {
        ...form,
        survey: surveyData,
      });

      setShowSurvey(false);
      setForm({ document_type: "", reserved_date: "", reserved_time: "" });
      setSurveyAnswers({});
      fetchMyReservations();

      alert("Reservation submitted! Please wait for approval.");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting reservation.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Request School Document
            </h1>
            <p className="text-gray-600 text-lg">
              Submit your document request and complete the required survey
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Document Request Form
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={onReserve} className="space-y-6">
                {/* Document Type Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Document Type *
                  </label>
                  <select
                      value={form.document_type}
                      onChange={(e) =>
                          setForm({ ...form, document_type: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400"
                  >
                    <option value="">Choose a document type...</option>
                    {types.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Date *
                    </label>
                    <input
                        type="date"
                        value={form.reserved_date}
                        onChange={(e) =>
                            setForm({ ...form, reserved_date: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preferred Time *
                    </label>
                    <input
                        type="time"
                        value={form.reserved_time}
                        onChange={(e) =>
                            setForm({ ...form, reserved_time: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Continue to Survey
                </button>
              </form>
            </div>
          </div>

          {/* Reservations Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Your Reservations
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              {myReservations.length > 0 ? (
                  <div className="space-y-4">
                    {myReservations.map((r) => (
                        <div
                            key={r.id}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 mb-1">
                                {r.document_type}
                              </div>
                              <div className="text-sm text-gray-600">
                                📅{" "}
                                {new Date(r.reserved_date).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                🕐 {r.reserved_time?.slice(0, 5)}
                              </div>

                              {/* Show decline reason if declined */}
                              {r.status?.toLowerCase() === "declined" && r.decline_reason && (
                                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                                    ❌ Reason: {r.decline_reason}
                                  </div>
                              )}
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    r.status
                                )}`}
                            >
                              {r.status || "Unknown"}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <p className="text-gray-500 text-lg">No reservations yet</p>
                    <p className="text-gray-400 text-sm">
                      Submit your first document request above
                    </p>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Survey Modal */}
        {showSurvey && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-2xl">
                  <h3 className="text-xl font-semibold text-white">
                    Required Survey
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Please complete all questions to proceed
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {surveyQuestions.length > 0 ? (
                      surveyQuestions.map((q, idx) => (
                          <div key={q.id} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Question {idx + 1}
                            </label>
                            <textarea
                                rows="3"
                                placeholder={`${q.question}`}
                                value={surveyAnswers[q.id] || ""}
                                onChange={(e) =>
                                    setSurveyAnswers({
                                      ...surveyAnswers,
                                      [q.id]: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                            />
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-3">❓</div>
                        <p className="text-gray-500">No survey questions available.</p>
                      </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                      onClick={() => setShowSurvey(false)}
                      className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={submitReservation}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200 font-medium shadow-lg"
                  >
                    Submit Reservation
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
