// 📂 src/pages/sag/SagApplications.tsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, FileText, RefreshCcw } from "lucide-react";

interface Application {
  _id: string;
  schemeName: string;
  urn: string;   // ✅ updated to match backend
  appliedDate: string;
  status: string;
  sagRemarks?: string;
  userId?: {
    username?: string;
    email?: string;
  };
  details?: {
    name?: string;
    email?: string;
  };
}

const SagApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Base API URL (single source of truth) – use same port as backend
  const API_BASE = "http://localhost:5000/api/applications";

  // ✅ Fetch all pending applications for SAG
  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${API_BASE}/sag/pending`);
      const data = await resp.json();

      if (resp.ok && data.success) {
        setApplications(data.applications || []);
      } else {
        setError(data.message || "Failed to fetch applications");
      }
    } catch (err) {
      setError("⚠️ Network error - make sure backend is running");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve application
  const handleApprove = async (urn: string) => {
    try {
      const resp = await fetch(`${API_BASE}/sag/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urn,
          action: "approve",
          remarks: "Approved by SAG",
        }),
      });

      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("✅ Application Approved");
        fetchApplications(); // Refresh the list
      } else {
        alert(data.message || "Failed to approve application");
      }
    } catch (err) {
      alert("⚠️ Network error");
      console.error("Approve error:", err);
    }
  };

  // ✅ Reject application
  const handleReject = async (urn: string) => {
    const remark = prompt("Enter rejection reason:") || "Rejected by SAG";
    if (!remark) return; // User cancelled

    try {
      const resp = await fetch(`${API_BASE}/sag/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urn,
          action: "reject",
          remarks: remark,
        }),
      });

      const data = await resp.json();

      if (resp.ok && data.success) {
        alert("❌ Application Rejected");
        fetchApplications(); // Refresh the list
      } else {
        alert(data.message || "Failed to reject application");
      }
    } catch (err) {
      alert("⚠️ Network error");
      console.error("Reject error:", err);
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending SAG":
        return "bg-amber-100 text-amber-700";
      case "Approved by SAG":
        return "bg-green-100 text-green-700";
      case "Rejected by SAG":
        return "bg-red-100 text-red-700";
      case "Approved by Finance":
        return "bg-blue-100 text-blue-700";
      case "Rejected by Finance":
        return "bg-red-100 text-red-700";
      case "Money Transferred":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
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
            <FileText className="h-6 w-6 text-blue-600" /> SAG Applications - Pending Review
          </h2>
          <Button
            onClick={fetchApplications}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Applications waiting for SAG approval. Approve or reject based on eligibility criteria.
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
            No pending applications found. All applications have been processed.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="border p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Application Details */}
                  <div className="md:col-span-2">
                    <p className="font-semibold text-gray-800 text-lg">{app.schemeName}</p>
                    <p className="text-sm text-gray-600">URN: {app.urn}</p>
                    <p className="text-sm text-gray-600">
                      Applied On:{" "}
                      {app.appliedDate
                        ? new Date(app.appliedDate).toLocaleDateString()
                        : "N/A"}
                    </p>

                    {/* Applicant Info */}
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-700">Applicant Details:</p>
                      <p className="text-sm text-gray-600">
                        Name: {app.details?.name || app.userId?.username || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Email: {app.details?.email || app.userId?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status:</p>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {/* Action buttons - Only show for Pending SAG status */}
                    {app.status === "Pending SAG" && (
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white text-sm"
                          onClick={() => handleApprove(app.urn)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white text-sm"
                          onClick={() => handleReject(app.urn)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}

                    {/* Show remarks if available */}
                    {app.sagRemarks && (
                      <div className="text-xs text-gray-500">
                        <p className="font-medium">Remarks:</p>
                        <p>{app.sagRemarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SagApplications;
