import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookies.js';
import Header from '../partials/Header';

function Login({ setToken, setIsAdmin }) {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aesKey, setAesKey] = useState('');
  const [isFaceLogin, setIsFaceLogin] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    UserID: '',
    register_code: '',
    Email: '',
    MatricNo: '',
    name: '',
    Phone: '',
    photo: '',
  });
  const [status, setStatus] = useState('');
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const navigate = useNavigate();

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        console.error('Error fetching location:', error);
      }
    );
  };

  const fetchSecurityCode = async () => {
    try {
      const response = await axios.get(`https:/text.olgtx.com/security-code?code=${formData.register_code}`);
      setAesKey(response.data.aes_key);
      return response.data.aes_key;
    } catch (err) {
      alert('Error fetching security code');
      return '';
    }
  };

  const encryptPassword = (pw, key) => {
    const iv = CryptoJS.enc.Utf8.parse(key.substring(32, 48));
    const aKey = CryptoJS.enc.Utf8.parse(key.substring(0, 32));
    const encrypted = CryptoJS.AES.encrypt(pw, aKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  };

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setStreaming(true);
        setTimeout(() => {
          stopStreaming();
        }, 10000);
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        setStatus('Unable to access camera');
      });
  };

  const stopStreaming = () => {
    const vid = videoRef.current;
    if (vid && vid.srcObject) {
      vid.srcObject.getTracks().forEach((t) => t.stop());
    }
    setStreaming(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
    setFormData({ ...formData, photo: imageBase64 });
    stopStreaming();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const key = await fetchSecurityCode();
    getLocation();
    const encryptedPassword = encryptPassword(password, key);
    const timestamp = Date.now();
    try {
      await axios.post('https://text.olgtx.com/register', {
        UserID: formData.UserID,
        register_code: formData.register_code,
        MetricNo: formData.MatricNo,
        Email: formData.Email,
        Name: formData.name,
        Phone: formData.Phone,
        Password: encryptedPassword,
        Photo: formData.photo,
      });

      await axios.post('https://text.olgtx.com/register-record', {
        UserID: formData.UserID,
        register_code: formData.register_code,
        latitude,
        longitude,
        timestamp,
      });

      alert('User registered successfully');
      setIsRegister(false);
      stopStreaming();
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error registering user');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://text.olgtx.com/fetch-aes-key', { Email });
      const key = response.data.aes_key;
      setAesKey(key);
      const encryptedPassword = encryptPassword(password, key);
      const res = await axios.post('https://text.olgtx.com/login', { Email, encryptedPassword });
      if (res.status === 200) {
        stopStreaming();
        setToken(res.data.token);
        setCookie('token', res.data.token);
        const adminFlag = res.data.user?.id === '130529200510115322';
        setIsAdmin(adminFlag);
        setCookie('isAdmin', adminFlag ? '1' : '0');
        navigate('/dashboard');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error logging in');
    }
  };

  const sendPhotoToBackend = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      setStatus('Verifying face...');
      const response = await axios.post('https://text.olgtx.com/api/verify-face', { photo });
      if (response.status === 200) {
        stopStreaming();
        setToken(response.data.token);
        setCookie('token', response.data.token);
        const adminFlag = response.data.user?.id === '130529200510115322';
        setIsAdmin(adminFlag);
        setCookie('isAdmin', adminFlag ? '1' : '0');
        navigate('/dashboard');
      } else {
        alert('Invalid face');
      }
    } catch (error) {
      console.error('Error verifying face:', error);
      setStatus('Face verification failed!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header sidebarOpen={false} setSidebarOpen={() => {}} variant="v2" />
      <div className="flex flex-col grow items-center justify-center px-6 py-12">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {isRegister
            ? 'Register Your Account'
            : isFaceLogin
            ? 'Face Login'
            : 'Sign in to your account'}
        </h2>
        <div className="w-full max-w-sm">
          {isRegister ? (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="flex flex-col items-center">
                <video ref={videoRef} className="border rounded-md" autoPlay playsInline />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex flex-col items-center">
                {!streaming ? (
                  <button type="button" onClick={startCamera} className="btn-primary w-full">
                    Allow Camera
                  </button>
                ) : (
                  <button type="button" onClick={capturePhoto} className="btn-primary w-full">
                    Capture Photo
                  </button>
                )}
              </div>
              <input
                type="text"
                name="UserID"
                placeholder="UserID"
                required
                onChange={(e) => setFormData({ ...formData, UserID: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="MatricNo"
                placeholder="Matric No"
                required
                onChange={(e) => setFormData({ ...formData, MatricNo: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                name="Email"
                placeholder="Email"
                required
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="Phone"
                placeholder="Phone"
                required
                onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="register_code"
                placeholder="register_code"
                required
                onChange={(e) => setFormData({ ...formData, register_code: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <button type="submit" className="btn-primary w-full">
                Register
              </button>
            </form>
          ) : isFaceLogin ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <video ref={videoRef} className="border rounded-md" autoPlay playsInline width="400" height="240" />
                <canvas ref={canvasRef} className="hidden" width="400" height="240" />
              </div>
              {!streaming ? (
                <button type="button" onClick={startCamera} className="btn-primary w-full">
                  Allow Camera
                </button>
              ) : (
                <button type="button" onClick={sendPhotoToBackend} className="btn-primary w-full">
                  Start Face Recognition Login
                </button>
              )}
              {status && <p className="text-center text-gray-600">{status}</p>}
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <button type="submit" className="btn-primary w-full">
                Sign in
              </button>
            </form>
          )}
          <div className="mt-6 text-center space-y-2">
            {!isRegister && (
              <button
                type="button"
                onClick={() => setIsFaceLogin((prev) => !prev)}
                className="text-sm text-violet-600 hover:underline"
              >
                {isFaceLogin ? 'Switch to Email Login' : 'Switch to Face Recognition Login'}
              </button>
            )}
            <div>
              <button
                type="button"
                onClick={() => setIsRegister((prev) => !prev)}
                className="text-sm text-violet-600 hover:underline"
              >
                {isRegister ? 'Back to login' : 'Sign up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
