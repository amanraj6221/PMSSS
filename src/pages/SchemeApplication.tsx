// 📂 src/pages/SchemeApplication.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useState } from "react";
import { schemes } from "./RecommendScheme";
import { useApplications } from "@/contexts/ApplicationContext";

function SchemeApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applyScheme } = useApplications();
  const scheme = schemes.find((s) => s.id === parseInt(id || "0"));

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    photo: null as File | null,
    address: "",
    email: "",
    casteCategory: "",
    religion: "",
    isMinority: "",
    aadharNumber: "",
    documents: [] as File[],
  });

  const [submitted, setSubmitted] = useState(false);
  const [urn, setUrn] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Single File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  // 🔹 Multiple Documents Upload
  const handleDocumentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        documents: files,
      }));
    }
  };

  // 🔹 Validation
  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Full Name is required.";
    if (!formData.dob) return "Date of Birth is required.";
    if (!formData.photo) return "Photograph is required.";
    if (!/^[0-9]{12}$/.test(formData.aadharNumber))
      return "Aadhaar number must be 12 digits.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      return "Valid Email is required.";
    if (!formData.address.trim()) return "Address is required.";
    if (!formData.casteCategory) return "Caste Category is required.";
    if (!formData.religion) return "Religion is required.";
    if (!formData.isMinority) return "Minority option is required.";
    if (formData.documents.length === 0) return "At least one document is required.";
    return null;
  };

  // 🔹 Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert("⚠️ " + error);
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("schemeId", String(scheme?.id || 0));
      payload.append("schemeName", scheme?.name || "Unknown Scheme");
      payload.append("applicantName", formData.name);
      payload.append("dob", formData.dob);
      payload.append("email", formData.email);
      payload.append("address", formData.address);
      payload.append("casteCategory", formData.casteCategory);
      payload.append("religion", formData.religion);
      payload.append("isMinority", formData.isMinority);
      payload.append("aadharNumber", formData.aadharNumber);

      if (formData.photo) payload.append("photo", formData.photo);
      formData.documents.forEach((doc) => payload.append("documents", doc));

      const res = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) throw new Error("Server Error");

      const data = await res.json();

      if (data.urn) {
        setUrn(data.urn);
        setSubmitted(true);
      } else {
        throw new Error("URN not received from server");
      }
    } catch (err: any) {
      console.error("❌ Error submitting application:", err);
      alert("Failed to submit application: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Scheme not found
  if (!scheme) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p className="text-red-600 text-center py-10">❌ Scheme not found.</p>
      </div>
    );
  }

  // 🔹 After Submission
  if (submitted) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-green-800 mb-4">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Your application for <b>{scheme.name}</b> has been submitted.</p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Your Unique Reference Number</h3>
            <p className="text-2xl font-bold text-blue-800">{urn}</p>
            <p className="text-sm text-gray-600 mt-2">Please save this number for tracking status.</p>
          </div>

          <div className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download Application Receipt
            </Button>
            <Button variant="outline" onClick={() => navigate("/user-dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 🔹 Application Form
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">Apply for {scheme.name}</h1>
        <p className="text-gray-600">Please fill out the application form completely. All fields are required.</p>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Caste Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Caste Category</label>
            <select
              name="casteCategory"
              value={formData.casteCategory}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">-- Select --</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>

          {/* Religion */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Religion</label>
            <input
              type="text"
              name="religion"
              value={formData.religion}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Minority */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Are you Minority?</label>
            <select
              name="isMinority"
              value={formData.isMinority}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Photograph Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Photograph</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "photo")}
              className="mt-1 block w-full"
              required
            />
          </div>

          {/* Documents Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
            <input
              type="file"
              multiple
              onChange={handleDocumentsUpload}
              className="mt-1 block w-full"
              required
            />
          </div>

          {/* Terms + Submit */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start mb-6">
              <input type="checkbox" id="terms" required className="mt-1 mr-2" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I hereby declare that all the information provided by me is true and correct. Any false information may lead to cancellation of my application.
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SchemeApplication;




// ?o

