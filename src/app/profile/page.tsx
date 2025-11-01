"use client";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-orange-600">My Profile</h1>
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 text-gray-700 max-w-lg">
          <h2 className="text-xl font-semibold mb-4 text-orange-600">Profile Overview</h2>
<div className="flex items-center gap-4 mb-4">
  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl text-white font-bold">J</div>
  <div>
    <div className="font-bold text-lg text-gray-900">John Doe</div>
    <div className="text-gray-600 text-sm">john.doe@example.com</div>
    <div className="text-xs text-gray-400 mt-1">Member since Jan 2023</div>
  </div>
</div>
<div className="grid grid-cols-2 gap-4 mb-6">
  <div className="bg-white border border-orange-100 rounded-lg p-4 text-center shadow-sm">
    <div className="text-2xl font-bold text-orange-600">3</div>
    <div className="text-xs text-gray-500">Total Orders</div>
  </div>
  <div className="bg-white border border-orange-100 rounded-lg p-4 text-center shadow-sm">
    <div className="text-2xl font-bold text-orange-600">2025-08-05</div>
    <div className="text-xs text-gray-500">Last Login</div>
  </div>
</div>
<div className="flex gap-3 mb-6">
  <a href="/profile/orders" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg text-center transition-all">View Orders</a>
  <a href="/profile/settings" className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-2 rounded-lg text-center transition-all">Account Settings</a>
</div>
<div className="text-gray-700 italic text-sm">“Your journey with The Raw Era starts here. Stay raw, stay real!”</div>
        </div>
      </div>
    </div>
  );
}


