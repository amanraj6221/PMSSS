// 📂 src/pages/UserDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/contexts/ApplicationContext";
import socket from "@/utils/socket"; // ✅ Socket import
import {
  FileText,
  BookOpen,
  CheckCircle,
  Clock,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  Award,
  Bell,
  User,
  Landmark,
  Home,
} from "lucide-react";

// ✅ ApplicationHistory import
import ApplicationHistory from "./ApplicationHistory";

function UserDashboard() {
  const { applications, fetchApplications } = useApplications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // 🔹 Fetch data on mount
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // 🔹 Socket event listeners
  useEffect(() => {
    socket.on("newApplication", () => {
      console.log("📥 New application submitted");
      fetchApplications();
    });

    socket.on("sagAction", () => {
      console.log("✅ SAG reviewed application");
      fetchApplications();
    });

    socket.on("financeAction", () => {
      console.log("💰 Finance reviewed application");
      fetchApplications();
    });

    socket.on("moneyTransferred", () => {
      console.log("💸 Payment transferred");
      fetchApplications();
    });

    return () => {
      socket.off("newApplication");
      socket.off("sagAction");
      socket.off("financeAction");
      socket.off("moneyTransferred");
    };
  }, [fetchApplications]);

  // 🔹 Stats
  const sagPending = applications.filter((a) => a.status === "Pending SAG").length;
  const sagApproved = applications.filter((a) => a.status === "Approved by SAG").length;
  const sagRejected = applications.filter((a) => a.status === "Rejected by SAG").length;
  const financeApproved = applications.filter((a) => a.status === "Approved by Finance").length;
  const financeRejected = applications.filter((a) => a.status === "Rejected by Finance").length;
  const disbursed = applications.filter((a) => a.status === "Money Transferred").length;

  const total = applications.length;
  const successRate = total > 0 ? Math.round((disbursed / total) * 100) : 0;

  // 🔹 Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending SAG":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "Approved by SAG":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Rejected by SAG":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "Approved by Finance":
        return <Landmark className="h-4 w-4 text-green-600" />;
      case "Rejected by Finance":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "Money Transferred":
        return <IndianRupee className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // 🔹 Status badge
  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      "Pending SAG": "bg-amber-100 text-amber-800",
      "Approved by SAG": "bg-green-100 text-green-800",
      "Rejected by SAG": "bg-red-100 text-red-800",
      "Approved by Finance": "bg-green-100 text-green-800",
      "Rejected by Finance": "bg-red-100 text-red-800",
      "Money Transferred": "bg-blue-100 text-blue-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded ${
              activeTab === "dashboard" ? "bg-blue-600 text-white" : "hover:bg-gray-200"
            }`}
          >
            <Home className="h-4 w-4" /> Overview
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded ${
              activeTab === "history" ? "bg-blue-600 text-white" : "hover:bg-gray-200"
            }`}
          >
            <FileText className="h-4 w-4" /> Application History
          </button>

          <button
            onClick={() => navigate("/dashboard/recommend")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200"
          >
            <BookOpen className="h-4 w-4" /> Browse Scholarships
          </button>

          <button className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
            <Bell className="h-4 w-4" /> Notifications
          </button>

          <button className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200">
            <User className="h-4 w-4" /> Profile
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome User 👋
                  </h2>
                  <p className="text-gray-600">
                    You have {applications.length} scholarship application
                    {applications.length !== 1 ? "s" : ""}.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/dashboard/recommend")}
                  className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Scholarships
                </Button>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-purple-600">{total}</h3>
                <p className="text-lg font-semibold mt-2 text-gray-700">Total Applications</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-amber-100 rounded-lg w-fit">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-3xl font-bold text-amber-600 mt-2">{sagPending}</h3>
                <p className="text-lg font-semibold text-gray-700">Pending SAG</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-green-100 rounded-lg w-fit">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-green-600 mt-2">
                  {sagApproved + financeApproved}
                </h3>
                <p className="text-lg font-semibold text-gray-700">Approved</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <IndianRupee className="h-6 w-6 text-blue-600" />
                  </div>
                  <Award className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-blue-600">{disbursed}</h3>
                <p className="text-lg font-semibold text-gray-700">Disbursed</p>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Recent Applications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("history")}
                >
                  View all
                </Button>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app.urn}
                      className="p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(app.status)}
                          <div>
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">
                              {app.schemeName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Applied: {new Date(app.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>

                      {/* Remarks */}
                      {app.remarks && (
                        <div className="mt-2 text-sm text-gray-600">
                          {app.remarks.sag && (
                            <p><strong>SAG:</strong> {app.remarks.sag}</p>
                          )}
                          {app.remarks.finance && (
                            <p><strong>Finance:</strong> {app.remarks.finance}</p>
                          )}
                          {app.remarks.payment && (
                            <p><strong>Payment:</strong> {app.remarks.payment}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No applications yet</p>
                  <Button onClick={() => navigate("/dashboard/recommend")}>
                    Apply for Scholarship
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start h-12"
                  onClick={() => navigate("/dashboard/recommend")}
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  Browse Scholarships
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12"
                  onClick={() => setActiveTab("history")}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  View Application History
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <Bell className="h-4 w-4 mr-3" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start h-12">
                  <User className="h-4 w-4 mr-3" />
                  Update Profile
                </Button>
              </div>
            </Card>

            {/* Application Statistics */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Application Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">
                      Success Rate
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {successRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ✅ Application History Tab */}
        {activeTab === "history" && <ApplicationHistory />}
      </main>
    </div>
  );
}

export default UserDashboard;
