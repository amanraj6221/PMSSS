// 📂 src/pages/finance/FinanceApplications.tsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, IndianRupee, RefreshCcw, FileText } from "lucide-react";

interface Application {
  _id: string;
  schemeName: string;
  urn: string;
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

const FinanceApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000/api/applications";

  // ✅ Fetch applications (SAG approved only)
  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${API_BASE}/finance/pending`);
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

  // ✅ Approve by Finance
  const handleApprove = async (id: string) => {
    try {
      const resp = await fetch(`${API_BASE}/finance/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: id, action: "approve", remarks: "Approved by Finance" }),
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

  // ✅ Reject by Finance
  const handleReject = async (id: string) => {
    const remark = prompt("Enter rejection reason:") || "Rejected by Finance";
    if (!remark) return;

    try {
      const resp = await fetch(`${API_BASE}/finance/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // ✅ Disburse Payment
  const handleDisburse = async (id: string) => {
    try {
      const resp = await fetch(`${API_BASE}/finance/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: id }),
      });
      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("💸 Payment Disbursed Successfully");
        fetchApplications();
      } else {
        alert(data.message || "Failed to disburse");
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
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" /> Finance Applications - SAG Approved
          </h2>
          <Button
            onClick={fetchApplications}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Review SAG approved applications. Approve, reject, or disburse payments.
        </p>
      </Card>

      {/* Applications List */}
      <Card className="p-6">
        {loading ? (
          <p className="text-gray-600 text-center py-8">Loading applications...</p>
        ) : error ? (
          <p className="text-red-600 text-center py-8">{error}</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No finance applications pending. All caught up!
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                <p className="font-semibold text-gray-800">{app.schemeName}</p>
                <p className="text-sm text-gray-600">URN: {app.urn}</p>
                <p className="text-sm text-gray-600">
                  Applicant: {app.details?.name || app.userId?.username || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {app.details?.email || app.userId?.email || "N/A"}
                </p>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
                    onClick={() => handleApprove(app._id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-sm"
                    onClick={() => handleReject(app._id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                    onClick={() => handleDisburse(app._id)}
                  >
                    <IndianRupee className="h-4 w-4 mr-1" /> Disburse
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FinanceApplications;
