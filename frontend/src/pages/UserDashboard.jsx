import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const UserDashboard = () => {
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <div className="min-h-screen bg-black text-white flex-center text-3xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white pt-24 px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent">
          My Purchased Courses
        </h1>

        {user.purchasedCourses.length === 0 ? (
          <p className="text-center text-xl text-gray-400">No courses purchased yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {user.purchasedCourses.map((pc) => (
              <div key={pc._id} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <img src={pc.course.thumbnail || "/placeholder.jpg"} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="text-2xl font-bold mb-2">{pc.course.subject}</h3>
                <p className="text-gray-400">Purchased on: {new Date(pc.purchasedAt).toLocaleDateString()}</p>
                <p className="text-sm text-purple-400 mt-2">Order ID: {pc.orderId}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;