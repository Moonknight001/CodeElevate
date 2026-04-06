import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { problemsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import DifficultyBadge from '../components/common/DifficultyBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiSearch, FiCheckCircle, FiFilter } from 'react-icons/fi';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const ProblemsPage = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (search.trim()) params.search = search.trim();
      const { data } = await problemsAPI.getAll(params);
      setProblems(data.problems);
    } catch (err) {
      setError('Failed to load problems. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [difficulty, search]);

  useEffect(() => {
    const timer = setTimeout(fetchProblems, 300);
    return () => clearTimeout(timer);
  }, [fetchProblems]);

  const solvedSet = new Set(user?.solvedProblems || []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Problems</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {problems.length} problem{problems.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="input-field pl-10"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400 shrink-0" />
            <div className="flex gap-1 flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    difficulty === d
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Loading problems..." />
          </div>
        ) : error ? (
          <div className="card p-8 text-center text-red-500 dark:text-red-400">{error}</div>
        ) : problems.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No problems found.</p>
            <button
              onClick={() => { setSearch(''); setDifficulty('All'); }}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Acceptance
                  </th>
                  {user && (
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                      Status
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {problems.map((problem, idx) => {
                  const solved = solvedSet.has(problem._id);
                  return (
                    <tr
                      key={problem._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-sm text-gray-400 dark:text-gray-500">
                        {problem.order || idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/problems/${problem.slug || problem._id}`}
                          className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                          {problem.title}
                        </Link>
                        {problem.tags?.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {problem.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 rounded px-1.5 py-0.5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <DifficultyBadge difficulty={problem.difficulty} />
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {problem.acceptanceRate}%
                      </td>
                      {user && (
                        <td className="py-3.5 px-4">
                          {solved && (
                            <FiCheckCircle className="text-green-500 text-lg" title="Solved" />
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;
