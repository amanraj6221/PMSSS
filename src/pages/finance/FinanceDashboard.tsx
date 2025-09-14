import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  CheckCircle,
  XCircle,
  IndianRupee,
  Settings,
  LogOut,
  FileText,
  RefreshCcw,
} from "lucide-react";

interface Application {
  _id: string;
  schemeName: string;
  urnNumber: string;
  appliedDate: string;
  status: string;
  sagRemarks?: string;
  financeRemarks?: string;
  userId?: {
    username?: string;
    email?: string;
  };
  details?: {
    name?: string;
    email?: string;
  };
}

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ API base from backend
  const API_BASE = "http://localhost:5000/api/applications";

  // ✅ Active route check
  const isActive = (path: string) => location.pathname.startsWith(path);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("finance_user");
    localStorage.removeItem("finance_token");
    navigate("/login/finance");
  };

  // ✅ Fetch all pending applications for Finance (only SAG approved)
  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${API_BASE}/finance/pending`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("finance_token")}`,
        },
      });
      const data = await resp.json();

      if (resp.ok && data.success) {
        setApplications(data.applications || []);
      } else {
        setError(data.message || "Failed to fetch applications");
      }
    } catch (err) {
      setError("⚠️ Network error - make sure backend is running");
      console.error("Finance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve application by Finance
  const handleApprove = async (id: string) => {
    try {
      const resp = await fetch(`${API_BASE}/finance/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("finance_token")}`,
        },
        body: JSON.stringify({
          appId: id,
          action: "approve",
          remarks: "Approved by Finance",
        }),
      });
      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("✅ Application Approved by Finance");
        fetchApplications();
      } else {
        alert(data.message || "Failed to approve");
      }
    } catch (err) {
      alert("⚠️ Network error");
      console.error("Finance approve error:", err);
    }
  };

  // ✅ Reject application by Finance
  const handleReject = async (id: string) => {
    const remark = prompt("Enter rejection reason:") || "Rejected by Finance";
    if (!remark) return;

    try {
      const resp = await fetch(`${API_BASE}/finance/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("finance_token")}`,
        },
        body: JSON.stringify({ appId: id, action: "reject", remarks: remark }),
      });
      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("❌ Application Rejected by Finance");
        fetchApplications();
      } else {
        alert(data.message || "Failed to reject");
      }
    } catch (err) {
      alert("⚠️ Network error");
      console.error("Finance reject error:", err);
    }
  };

  // ✅ Mark payment as transferred
  const handleDisburse = async (id: string) => {
    try {
      const resp = await fetch(`${API_BASE}/finance/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("finance_token")}`,
        },
        body: JSON.stringify({ appId: id }),
      });
      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("💸 Payment Disbursed Successfully");
        fetchApplications();
      } else {
        alert(data.message || "Failed to disburse payment");
      }
    } catch (err) {
      alert("⚠️ Network error");
      console.error("Disburse error:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="w-64 flex-shrink-0">
        <Card className="p-6 min-h-screen rounded-none flex flex-col">
          {/* Profile */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <IndianRupee className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Finance Bureau</h3>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => navigate("/dashboard/finance")}
              className={`w-full text-left flex items-center px-4 py-3 rounded-lg text-sm ${
                isActive("/dashboard/finance")
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Home className="h-4 w-4 mr-3" />
              New Applications
            </button>
            <button
              onClick={() => alert("✅ Show approved list (future)")}
              className="w-full text-left flex items-center px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              <CheckCircle className="h-4 w-4 mr-3" />
              Approved
            </button>
            <button
              onClick={() => alert("❌ Show rejected list (future)")}
              className="w-full text-left flex items-center px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              <XCircle className="h-4 w-4 mr-3" />
              Rejected
            </button>
            <button
              onClick={() => alert("💸 Show disbursed list (future)")}
              className="w-full text-left flex items-center px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              <IndianRupee className="h-4 w-4 mr-3" />
              Disbursed
            </button>
            <button
              onClick={() => alert("⚙️ Settings (future)")}
              className="w-full text-left flex items-center px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </button>
          </nav>

          {/* Logout */}
          <div className="pt-6 border-t border-gray-200 mt-6">
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </Card>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" /> New Applications
            (SAG Approved)
          </h2>
          <Button
            onClick={fetchApplications}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-center py-8">
            Loading applications...
          </p>
        ) : error ? (
          <p className="text-red-600 text-center py-8">{error}</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No new applications available for Finance review.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card
                key={app._id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <p className="font-semibold text-gray-800">{app.schemeName}</p>
                <p className="text-sm text-gray-600">URN: {app.urnNumber}</p>
                <p className="text-sm text-gray-600">
                  Applicant:{" "}
                  {app.details?.name || app.userId?.username || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {app.details?.email || app.userId?.email || "N/A"}
                </p>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                    onClick={() => handleApprove(app._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-sm"
                    onClick={() => handleReject(app._id)}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                    onClick={() => handleDisburse(app._id)}
                  >
                    Disburse Payment
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FinanceDashboard;
