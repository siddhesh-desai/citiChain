import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add real auth logic here
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-8 bg-white shadow rounded">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
        <input className="border p-2 mb-4 w-full" placeholder="Username" />
        <input className="border p-2 mb-4 w-full" placeholder="Password" type="password" />
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
