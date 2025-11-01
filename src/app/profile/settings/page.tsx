"use client";
import { useState } from "react";
export default function ProfileSettingsPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6 text-orange-600">Account Settings</h1>
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 text-gray-700 space-y-8">
          {/* Profile Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-orange-600">Profile Information</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
                <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                <input type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" defaultValue="john.doe@example.com" />
              </div>
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2 px-6 transition-all">Save Changes</button>
            </form>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-orange-600">Security</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">New Password</label>
                <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" placeholder="New Password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Confirm Password</label>
                <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" placeholder="Confirm Password" />
              </div>
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2 px-6 transition-all">Change Password</button>
            </form>
          </div>

          {/* Notification Preferences */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-orange-600">Notification Preferences</h2>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} className="accent-orange-500" />
                <span>Email Notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={notifSMS} onChange={() => setNotifSMS(!notifSMS)} className="accent-orange-500" />
                <span>SMS Notifications</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-orange-100">
            <h2 className="text-lg font-semibold mb-3 text-red-600">Danger Zone</h2>
            <button className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg py-2 px-6 transition-all border border-red-200">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
