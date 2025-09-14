import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SagApplicationDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<any>(null);
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("sag_approved");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/application/history/${id}`)
      .then(res => res.json())
      .then(data => setApplication(data));
  }, [id]);

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:5000/api/sag/take-action/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, sagRemark: remark }),
    }).then(res => res.json());

    if (res.success) navigate("/sag/dashboard");
    else alert(res.message);
  };

  if (!application) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Application Detail</h2>
      <div className="mb-4">
        <p><strong>Reference:</strong> {application.referenceNo}</p>
        <p><strong>User ID:</strong> {application.userId}</p>
        <p><strong>Scheme:</strong> {application.schemeName}</p>
        <p><strong>Applied Date:</strong> {new Date(application.appliedDate).toLocaleString()}</p>
      </div>

      <div className="flex flex-col space-y-2">
        <textarea placeholder="Remark" value={remark} onChange={e => setRemark(e.target.value)} className="border p-2" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2">
          <option value="sag_approved">Approve</option>
          <option value="rejected">Reject</option>
        </select>
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </div>
    </div>
  );
};

export default SagApplicationDetail;
