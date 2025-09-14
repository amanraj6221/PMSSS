// 📂 src/pages/sag/SagDashboard.tsx
import React, { useEffect, useState } from "react";

interface Application {
  _id: string;
  schemeName: string;
  applicantName: string;
  urnNumber: string;
  status: string;
  appliedDate: string;
  remarks?: {
    sag?: string;
    finance?: string;
    payment?: string;
  };
  userId: {
    username: string;
    email: string;
  };
}

const SagDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    newApplications: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0,
    totalApplications: 0,
  });

  // ✅ Fetch All Applications for SAG
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const resp = await fetch(
        "http://localhost:5000/api/applications/sag/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("sag_token")}`,
          },
        }
      );
      const data = await resp.json();
      if (resp.ok && data.success) {
        const apps: Application[] = data.applications || [];
        setApplications(apps);

        setStats({
          newApplications: apps.filter((a) => a.status === "Pending SAG").length,
          approved: apps.filter((a) => a.status === "Approved by SAG").length,
          rejected: apps.filter((a) => a.status === "Rejected by SAG").length,
          disbursed: apps.filter((a) => a.status === "Money Transferred").length,
          totalApplications: apps.length,
        });
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAG Approve/Reject Action
  const handleAction = async (appId: string, action: "approve" | "reject") => {
    const remarks =
      action === "reject"
        ? prompt("Enter rejection remark:") || "No remark"
        : "";

    try {
      const resp = await fetch(
        "http://localhost:5000/api/applications/sag/action",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sag_token")}`,
          },
          body: JSON.stringify({ appId, action, remarks }),
        }
      );
      const data = await resp.json();
      if (resp.ok && data.success) {
        alert(
          action === "approve"
            ? "✅ Application Approved & Sent to Finance"
            : "❌ Application Rejected"
        );
        fetchApplications();
      } else {
        alert("⚠️ Failed to update application");
      }
    } catch {
      alert("⚠️ Network error");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">SAG Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded shadow">
          <p className="text-lg font-bold">{stats.newApplications}</p>
          <p className="text-sm">New Applications</p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow">
          <p className="text-lg font-bold">{stats.approved}</p>
          <p className="text-sm">Approved</p>
        </div>
        <div className="p-4 bg-red-100 rounded shadow">
          <p className="text-lg font-bold">{stats.rejected}</p>
          <p className="text-sm">Rejected</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow">
          <p className="text-lg font-bold">{stats.disbursed}</p>
          <p className="text-sm">Money Transferred</p>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications available</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">URN</th>
              <th className="p-2 border">Applicant</th>
              <th className="p-2 border">Scheme</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Applied Date</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="text-center">
                <td className="p-2 border">{app.urnNumber}</td>
                <td className="p-2 border">{app.applicantName}</td>
                <td className="p-2 border">{app.schemeName}</td>
                <td className="p-2 border">{app.status}</td>
                <td className="p-2 border">
                  {new Date(app.appliedDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {app.remarks?.sag || "-"}
                </td>
                <td className="p-2 border">
                  {app.status === "Pending SAG" && (
                    <div className="flex gap-2 justify-center">
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded"
                        onClick={() => handleAction(app._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => handleAction(app._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SagDashboard;
