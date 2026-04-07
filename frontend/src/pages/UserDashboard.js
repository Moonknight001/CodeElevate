import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import DifficultyBadge from '../components/common/DifficultyBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiCode, FiCheckCircle, FiClock, FiTrendingUp, FiList } from 'react-icons/fi';

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="card p-5">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
      <Icon className="text-lg text-white" />
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
  </div>
);

const DifficultyProgress = ({ label, solved, color }) => (
  <div className="flex items-center justify-between py-2">
    <span className={`text-sm font-medium ${color}`}>{label}</span>
    <span className="text-sm font-bold text-gray-900 dark:text-white">{solved}</span>
  </div>
);

const statusColors = {
  Accepted: 'text-green-600 dark:text-green-400',
  'Wrong Answer': 'text-red-600 dark:text-red-400',
  'Time Limit Exceeded': 'text-yellow-600 dark:text-yellow-400',
  'Runtime Error': 'text-orange-600 dark:text-orange-400',
  'Compilation Error': 'text-red-600 dark:text-red-400',
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, statsRes] = await Promise.all([
          userAPI.getProfile(),
          userAPI.getStats(),
        ]);
        setProfile(profileRes.data);
        setStats(statsRes.data);
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const userData = profile || {};
  const statsData = stats?.stats || user?.stats || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {userData.username?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {userData.username || user?.username}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{userData.email || user?.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FiCheckCircle}
            value={statsData.totalSolved || 0}
            label="Total Solved"
            color="bg-blue-500"
          />
          <StatCard
            icon={FiCode}
            value={statsData.easySolved || 0}
            label="Easy Solved"
            color="bg-green-500"
          />
          <StatCard
            icon={FiTrendingUp}
            value={statsData.mediumSolved || 0}
            label="Medium Solved"
            color="bg-yellow-500"
          />
          <StatCard
            icon={FiTrendingUp}
            value={statsData.hardSolved || 0}
            label="Hard Solved"
            color="bg-red-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiTrendingUp /> Progress
            </h2>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
              <DifficultyProgress
                label="Easy"
                solved={statsData.easySolved || 0}
                color="text-green-600 dark:text-green-400"
              />
              <DifficultyProgress
                label="Medium"
                solved={statsData.mediumSolved || 0}
                color="text-yellow-600 dark:text-yellow-400"
              />
              <DifficultyProgress
                label="Hard"
                solved={statsData.hardSolved || 0}
                color="text-red-600 dark:text-red-400"
              />
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Solved</span>
                <span>{statsData.totalSolved || 0} problems</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min(((statsData.totalSolved || 0) / 8) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="card p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiClock /> Recent Submissions
            </h2>
            {stats?.recentSubmissions?.length > 0 ? (
              <div className="space-y-2">
                {stats.recentSubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div>
                      <Link
                        to={`/problems/${sub.problem?.slug || sub.problem?._id}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {sub.problem?.title || 'Unknown Problem'}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <DifficultyBadge difficulty={sub.problem?.difficulty} />
                        <span className="text-xs text-gray-400 capitalize">{sub.language}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold ${statusColors[sub.status] || 'text-gray-500'}`}>
                        {sub.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 dark:text-gray-500">
                <FiList className="text-3xl mx-auto mb-2 opacity-40" />
                <p className="text-sm">No submissions yet. Start solving!</p>
                <Link to="/problems" className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-2 inline-block">
                  Browse Problems →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Solved Problems */}
        {userData.solvedProblems?.length > 0 && (
          <div className="card p-6 mt-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-green-500" /> Solved Problems
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {userData.solvedProblems.map((p) => (
                <Link
                  key={p._id}
                  to={`/problems/${p.slug || p._id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {p.title}
                  </span>
                  <DifficultyBadge difficulty={p.difficulty} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
