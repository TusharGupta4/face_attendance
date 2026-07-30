import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";
function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const cards = [
    {
      title: "Register Face",
      icon: "📷",
      path: "/register-face",
    },
    {
      title: "Attendance",
      icon: "✅",
      path: "/attendance",
    },
    {
      title: "History",
      icon: "📋",
      path: "/history",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-blue-600 text-white shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          <h1 className="text-2xl font-bold">
            Face Attendance System
          </h1>

          <button
            onClick={logout}
            className="bg-white text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-10">

        <div className="mb-10">

          <h2 className="text-4xl font-bold">
            Welcome, {user?.name || "User"} 👋
          </h2>

          <p className="text-gray-600 mt-2">
            {user?.email}
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.path}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-10 text-center"
            >
              <div className="text-6xl mb-6">
                {card.icon}
              </div>

              <h3 className="text-2xl font-semibold">
                {card.title}
              </h3>
            </Link>
          ))}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;