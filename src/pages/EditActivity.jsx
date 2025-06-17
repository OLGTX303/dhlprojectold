import React, { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';

const initial = [
  { date: '2024-01-01', start: '09:00', end: '10:00', desc: 'Email' },
];

function EditActivity() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState(null);

  const handleSave = (idx) => {
    setEditing(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 space-y-4">
          <h2 className="text-xl font-bold">Edit Activity</h2>
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Start</th>
                <th className="p-2 border">End</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 border">{row.date}</td>
                  <td className="p-2 border">
                    {editing === idx ? (
                      <input type="time" defaultValue={row.start} className="border p-1" />
                    ) : (
                      row.start
                    )}
                  </td>
                  <td className="p-2 border">
                    {editing === idx ? (
                      <input type="time" defaultValue={row.end} className="border p-1" />
                    ) : (
                      row.end
                    )}
                  </td>
                  <td className="p-2 border">
                    {editing === idx ? (
                      <input defaultValue={row.desc} className="border p-1" />
                    ) : (
                      row.desc
                    )}
                  </td>
                  <td className="p-2 border">
                    {editing === idx ? (
                      <>
                        <button className="btn-primary mr-1" onClick={() => handleSave(idx)}>Save</button>
                        <button className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn-primary" onClick={() => setEditing(idx)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-sm text-gray-500">You can only edit your own logs.</div>
          <button className="btn-secondary">View Audit Log</button>
        </main>
      </div>
    </div>
  );
}

export default EditActivity;
