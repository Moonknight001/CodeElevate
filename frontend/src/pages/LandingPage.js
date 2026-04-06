import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCode, FiZap, FiTrendingUp, FiUsers, FiArrowRight } from 'react-icons/fi';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="card p-6 flex flex-col gap-3">
    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
      <Icon className="text-blue-600 dark:text-blue-400 text-xl" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
  </div>
);

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <FiZap className="text-yellow-300" />
            <span>Your personal coding practice platform</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Elevate Your{' '}
            <span className="text-yellow-300">Coding Skills</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Practice coding problems, track your progress, and prepare for technical interviews — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <button
                onClick={() => navigate('/problems')}
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl transition-colors text-lg"
              >
                Explore Problems <FiArrowRight />
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl transition-colors text-lg"
                >
                  Get Started Free <FiArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 font-bold py-3 px-8 rounded-xl transition-colors text-lg"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8">
          <StatItem value="8+" label="Coding Problems" />
          <StatItem value="4" label="Languages Supported" />
          <StatItem value="3" label="Difficulty Levels" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Everything you need to level up
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            A complete environment to practice, learn, and track your progress
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={FiCode}
            title="Multi-Language Editor"
            description="Write code in JavaScript, Python, C++, or Java with syntax highlighting, auto-completion, and Monaco Editor support."
          />
          <FeatureCard
            icon={FiZap}
            title="Instant Code Execution"
            description="Run your code against test cases in real-time powered by the Judge0 API. See output, execution time, and memory usage."
          />
          <FeatureCard
            icon={FiTrendingUp}
            title="Progress Tracking"
            description="Track which problems you've solved, view submission history, and monitor your stats by difficulty level."
          />
          <FeatureCard
            icon={FiUsers}
            title="Problem Filtering"
            description="Browse problems by difficulty — Easy, Medium, or Hard. Search by title to find exactly what you need."
          />
          <FeatureCard
            icon={FiCode}
            title="Split-Screen Workspace"
            description="View problem description alongside your code editor. A distraction-free environment for deep focus."
          />
          <FeatureCard
            icon={FiZap}
            title="Dark & Light Mode"
            description="Switch between dark and light themes to suit your preference and coding environment."
          />
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="bg-blue-600 dark:bg-blue-700 py-16 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Ready to start coding?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join CodeElevate and start solving problems today. It's free.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl transition-colors text-lg"
            >
              Get Started <FiArrowRight />
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiCode className="text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-gray-900 dark:text-white">CodeElevate</span>
          </div>
          <p>Your personal LeetCode-style coding practice platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
