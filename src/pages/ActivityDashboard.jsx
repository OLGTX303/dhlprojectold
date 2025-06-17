import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const sampleData = [
  { time: '09:00', task: 'Email', duration: '10m' },
  { time: '09:10', task: 'Coding', duration: '50m' },
];

function ActivityDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [offline, setOffline] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 space-y-4">
          {offline && (
            <div className="bg-yellow-200 p-2 rounded">Offline - syncing when connection resumes</div>
          )}
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Timestamp</th>
                <th className="p-2 border">Task</th>
                <th className="p-2 border">Duration</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 border">{row.time}</td>
                  <td className="p-2 border">{row.task}</td>
                  <td className="p-2 border">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="space-x-2">
            <button className="btn-primary">Sync Now</button>
            <button className="btn-secondary">Retry Upload</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ActivityDashboard;
