// 📂 src/pages/ProfileSettings.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function ProfileSettings() {
  // Dummy state (replace with actual user data from context or API)
  const [profile, setProfile] = useState({
    fullName: "Aman Raj",
    email: "amanraj6221@gmail.com",
    phone: "9876543210",
    dob: "2000-01-01",
    address: "Patna, Bihar",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // 🔗 Save API call or context update
    console.log("Updated profile:", profile);
    alert("Profile updated successfully ✅");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Profile Settings</h2>
        <p className="text-gray-600 mb-6">Update your account information</p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* DOB */}
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={profile.dob}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          {/* Address (Full Width) */}
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
        </form>

        {/* Save Button */}
        <div className="mt-6">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ProfileSettings;
