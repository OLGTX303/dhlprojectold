import React, { useState } from 'react';

function Login() {
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for authentication logic
    setError('Incorrect credentials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">Login</h1>
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" required />
        <input type="password" placeholder="Password" className="w-full border p-2 rounded" required />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="btn-primary w-full">Login</button>
        <button type="button" className="btn-secondary w-full">Face Recognition (placeholder)</button>
      </form>
    </div>
  );
}

export default Login;
