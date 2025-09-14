// 📂 src/contexts/ApplicationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import api from "@/api/axios";
import socket from "@/utils/socket";

// ----------------- Types -----------------
export interface Application {
  _id?: string;
  schemeId: string | number;
  schemeName: string;
  applicantName: string;
  appliedDate: string;
  status:
    | "Pending SAG"
    | "Approved by SAG"
    | "Rejected by SAG"
    | "Approved by Finance"
    | "Rejected by Finance"
    | "Money Transferred";
  urn: string;
  amount?: string | number;
  sagRemarks?: string;
  financeRemarks?: string;
  paymentRemarks?: string;
  userId: string;
  [key: string]: any; // allow backend raw fields
}

interface ApplicationContextType {
  applications: Application[];
  applyScheme: (application: {
    schemeId: string | number;
    schemeName: string;
    applicantName: string;
    amount?: string | number;
    details?: any;
  }) => Promise<void>;
  updateSag: (
    appId: string,
    action: "approve" | "reject",
    remarks: string
  ) => Promise<void>;
  updateFinance: (
    appId: string,
    action: "approve" | "reject",
    remarks: string,
    amount?: string | number
  ) => Promise<void>;
  completePayment: (appId: string, remark?: string) => Promise<void>;
  refreshApplications: (userId: string) => Promise<void>;
  fetchApplications: (userId: string) => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined
);

// ----------------- Helpers -----------------
const normalizeApp = (app: any): Application => ({
  ...app,
  urn: app.urn || app.urnNumber || app.urn_no || "",
  status: app.status || "Pending SAG",
  appliedDate: app.appliedDate || new Date().toISOString(),
});

// ----------------- Provider -----------------
export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const API_BASE = "/applications";

  // persist
  const persist = (apps: Application[]) => {
    setApplications(apps);
    try {
      localStorage.setItem("applications", JSON.stringify(apps));
    } catch {
      // ignore storage error
    }
  };

  // refreshApplications
  const refreshApplications = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const resp = await api.get(`${API_BASE}/user/${userId}`);
      if (Array.isArray(resp.data)) {
        const apps = resp.data.map(normalizeApp);
        persist(apps);
      } else {
        console.error("❌ Failed to fetch apps:", resp.data);
      }
    } catch (err) {
      console.warn("⚠️ refreshApplications failed:", err);
    }
  }, []);

  const fetchApplications = async (userId: string) => {
    return refreshApplications(userId);
  };

  // applyScheme (with FormData)
  const applyScheme = async ({
    schemeId,
    schemeName,
    applicantName,
    amount,
    details,
  }: {
    schemeId: string | number;
    schemeName: string;
    applicantName: string;
    amount?: string | number;
    details?: any;
  }) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("⚠️ You are not logged in. Please login and try again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("schemeId", String(schemeId));
      formData.append("schemeName", schemeName);
      formData.append("applicantName", applicantName);
      formData.append("appliedDate", new Date().toISOString());
      formData.append("amount", String(amount || 0));

      if (details) {
        Object.keys(details).forEach((key) => {
          const value = details[key];
          if (key === "photo" && value instanceof File) {
            formData.append("photo", value);
          } else if (key === "documents" && Array.isArray(value)) {
            value.forEach((file: File) => formData.append("documents", file));
          } else {
            formData.append(key, value);
          }
        });
      }

      const resp = await api.post(`${API_BASE}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (resp.data?.urn) {
        const savedApp: Application = normalizeApp({
          schemeId,
          schemeName,
          applicantName,
          amount,
          userId,
          urn: resp.data.urn,
          status: "Pending SAG",
          appliedDate: new Date().toISOString(),
        });

        const newList = [savedApp, ...applications];
        persist(newList);

        setTimeout(() => refreshApplications(userId), 800);
        alert(`✅ Application submitted successfully. URN: ${resp.data.urn}`);
      } else {
        console.error("❌ Apply failed:", resp.data);
        alert(resp.data?.message || "Failed to apply. Please try again.");
      }
    } catch (err: any) {
      console.error("⚠️ Error while applying:", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Network or server error while applying"
      );
    }
  };

  // ------- updateSag, updateFinance, completePayment same as before --------

  // socket listeners
  useEffect(() => {
    const onNew = (app: any) => {
      const normalized = normalizeApp(app);
      setApplications((prev) => {
        const exists = prev.some((p) => p._id === normalized._id);
        return exists ? prev : [normalized, ...prev];
      });
    };

    const onUpdate = (updated: any) => {
      const normalized = normalizeApp(updated);
      setApplications((prev) =>
        prev.map((a) => (a._id === normalized._id ? normalized : a))
      );
    };

    socket.on("newApplication", onNew);
    socket.on("sagAction", onUpdate);
    socket.on("financeAction", onUpdate);
    socket.on("paymentTransferred", onUpdate);

    return () => {
      socket.off("newApplication", onNew);
      socket.off("sagAction", onUpdate);
      socket.off("financeAction", onUpdate);
      socket.off("paymentTransferred", onUpdate);
    };
  }, []);

  // load cached apps on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("applications");
      if (stored) setApplications(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        applyScheme,
        updateSag: async () => {},
        updateFinance: async () => {},
        completePayment: async () => {},
        refreshApplications,
        fetchApplications,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplications must be used within an ApplicationProvider");
  }
  return context;
};
