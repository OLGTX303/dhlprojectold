import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const data = [
  { user: 'Alice', status: 'Active', tasks: 5, duration: '3h' },
  { user: 'Bob', status: 'Idle', tasks: 2, duration: '1h' },
];


function TeamDashboard({ isAdmin }) {

function TeamDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4">
          <h2 className="text-xl font-bold mb-4">Team Dashboard</h2>

          {isAdmin && (
            <button className="btn-primary mb-2">Edit Members</button>
          )}

          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Member</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Tasks Today</th>
                <th className="p-2 border">Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 border">{row.user}</td>
                  <td className="p-2 border">{row.status}</td>
                  <td className="p-2 border">{row.tasks}</td>
                  <td className="p-2 border">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 text-sm text-gray-500">WebSocket indicator (placeholder)</div>
        </main>
      </div>
    </div>
  );
}

export default TeamDashboard;
