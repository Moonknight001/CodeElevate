import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { problemsAPI, submissionsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DifficultyBadge from '../components/common/DifficultyBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  FiPlay, FiSend, FiChevronLeft, FiCheckCircle, FiXCircle,
  FiClock, FiCpu
} from 'react-icons/fi';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', monaco: 'javascript' },
  { value: 'python', label: 'Python', monaco: 'python' },
  { value: 'cpp', label: 'C++', monaco: 'cpp' },
  { value: 'java', label: 'Java', monaco: 'java' },
];

const DEFAULT_THEME_DARK = 'vs-dark';
const DEFAULT_THEME_LIGHT = 'light';

const ProblemWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  const [activeTab, setActiveTab] = useState('description'); // description | output
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [leftWidth, setLeftWidth] = useState(50); // percent
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const { data } = await problemsAPI.getById(id);
        setProblem(data);
        // Initialize with the currently selected language's starter code
        setCode((prev) => {
          if (prev) return prev; // don't overwrite if user already typed
          return data.starterCode?.[language] || '';
        });
      } catch {
        setError('Problem not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
    // We only want to refetch when the problem ID changes, not when language changes.
    // Language changes are handled by handleLanguageChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLanguageChange = useCallback((newLang) => {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang]) {
      setCode(problem.starterCode[newLang]);
    }
  }, [problem]);

  const handleRun = async () => {
    if (!user) { navigate('/login'); return; }
    setRunning(true);
    setActiveTab('output');
    setRunResult(null);
    try {
      const { data } = await submissionsAPI.run({
        code,
        language,
        problemId: problem._id,
      });
      setRunResult(data);
    } catch (err) {
      setRunResult({ error: err.response?.data?.message || 'Execution failed' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    setActiveTab('output');
    setSubmitResult(null);
    try {
      const { data } = await submissionsAPI.submit({
        problemId: problem._id,
        language,
        code,
      });
      setSubmitResult(data);
      // Update user stats in context if accepted
      if (data.status === 'Accepted' && user) {
        updateUser({
          stats: {
            ...user.stats,
            totalSolved: (user.stats?.totalSolved || 0) + 1,
          },
        });
      }
    } catch (err) {
      setSubmitResult({ error: err.response?.data?.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  // Resizable divider
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const container = document.getElementById('workspace-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(Math.max(pct, 25), 75));
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <LoadingSpinner text="Loading problem..." />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg">{error || 'Problem not found'}</p>
        <button onClick={() => navigate('/problems')} className="btn-primary">
          Back to Problems
        </button>
      </div>
    );
  }

  const monacoLang = LANGUAGES.find((l) => l.value === language)?.monaco || 'javascript';

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/problems')}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center gap-1 text-sm"
          >
            <FiChevronLeft /> Problems
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className="font-semibold text-gray-900 dark:text-white text-sm truncate max-w-xs">
            {problem.title}
          </span>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>

        <div className="flex items-center gap-2">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          <button
            onClick={handleRun}
            disabled={running || submitting}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <FiPlay className="text-green-400" />
            {running ? 'Running...' : 'Run'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={running || submitting}
            className="flex items-center gap-1.5 btn-primary text-sm py-1.5 px-4 disabled:opacity-50"
          >
            <FiSend />
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div
        id="workspace-container"
        className="flex flex-1 overflow-hidden"
        style={{ userSelect: isDragging ? 'none' : 'auto' }}
      >
        {/* Left: Problem Description */}
        <div
          className="flex flex-col overflow-hidden bg-white dark:bg-gray-900"
          style={{ width: `${leftWidth}%`, minWidth: 0 }}
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'output'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Output
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'description' ? (
              <ProblemDescription problem={problem} />
            ) : (
              <OutputPanel
                runResult={runResult}
                submitResult={submitResult}
                running={running}
                submitting={submitting}
              />
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          className={`w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-blue-400 dark:hover:bg-blue-500 cursor-col-resize shrink-0 transition-colors ${
            isDragging ? 'bg-blue-400 dark:bg-blue-500' : ''
          }`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        />

        {/* Right: Editor */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={monacoLang}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme={isDark ? DEFAULT_THEME_DARK : DEFAULT_THEME_LIGHT}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              wordWrap: 'on',
              formatOnType: true,
              automaticLayout: true,
              tabSize: 2,
              padding: { top: 12 },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ProblemDescription = ({ problem }) => (
  <div className="space-y-6 text-sm">
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{problem.title}</h1>
      <DifficultyBadge difficulty={problem.difficulty} />
    </div>

    <div className="prose dark:prose-invert max-w-none">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
        {problem.description}
      </p>
    </div>

    {problem.examples?.length > 0 && (
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Examples</h3>
        <div className="space-y-3">
          {problem.examples.map((ex, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 font-mono text-xs">
              <div><span className="text-gray-500">Input:</span> <span className="text-gray-800 dark:text-gray-200">{ex.input}</span></div>
              <div><span className="text-gray-500">Output:</span> <span className="text-gray-800 dark:text-gray-200">{ex.output}</span></div>
              {ex.explanation && (
                <div className="mt-1 text-gray-500 not-italic">
                  <span className="font-sans font-medium">Explanation:</span> {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {problem.constraints?.length > 0 && (
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Constraints</h3>
        <ul className="space-y-1">
          {problem.constraints.map((c, i) => (
            <li key={i} className="text-gray-600 dark:text-gray-400 font-mono text-xs bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded">
              {c}
            </li>
          ))}
        </ul>
      </div>
    )}

    {problem.tags?.length > 0 && (
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag) => (
            <span key={tag} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const OutputPanel = ({ runResult, submitResult, running, submitting }) => {
  if (running || submitting) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
        <LoadingSpinner />
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {running ? 'Running your code...' : 'Submitting and testing...'}
        </p>
      </div>
    );
  }

  if (!runResult && !submitResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <FiPlay className="text-4xl text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Run your code or submit to see results here
        </p>
      </div>
    );
  }

  if (submitResult) {
    return <SubmitResult result={submitResult} />;
  }

  if (runResult) {
    return <RunResult result={runResult} />;
  }

  return null;
};

const RunResult = ({ result }) => {
  if (result.error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-700 dark:text-red-400 font-medium mb-1">Error</p>
        <pre className="text-red-600 dark:text-red-300 text-xs whitespace-pre-wrap">{result.error}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500">Status:</span>
        <span className={`font-semibold ${result.status === 'Accepted' ? 'text-green-600' : 'text-yellow-600'}`}>
          {result.status}
        </span>
        {result.time && (
          <span className="flex items-center gap-1 text-gray-500">
            <FiClock className="text-xs" /> {result.time}s
          </span>
        )}
        {result.memory > 0 && (
          <span className="flex items-center gap-1 text-gray-500">
            <FiCpu className="text-xs" /> {result.memory} KB
          </span>
        )}
      </div>

      {result.output && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output</p>
          <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-auto max-h-40">
            {result.output}
          </pre>
        </div>
      )}

      {(result.stderr || result.compile_output) && (
        <div>
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Error</p>
          <pre className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-xs text-red-700 dark:text-red-400 whitespace-pre-wrap overflow-auto max-h-40">
            {result.stderr || result.compile_output}
          </pre>
        </div>
      )}
    </div>
  );
};

const SubmitResult = ({ result }) => {
  if (result.error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-700 dark:text-red-400 font-medium">Error</p>
        <pre className="text-red-600 dark:text-red-300 text-xs whitespace-pre-wrap mt-1">{result.error}</pre>
      </div>
    );
  }

  const isAccepted = result.status === 'Accepted';
  const passedCount = result.testResults?.filter((t) => t.passed).length || 0;
  const totalCount = result.testResults?.length || 0;

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-xl border ${isAccepted
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {isAccepted
            ? <FiCheckCircle className="text-green-600 text-2xl" />
            : <FiXCircle className="text-red-600 text-2xl" />
          }
          <span className={`text-xl font-bold ${isAccepted ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            {result.status}
          </span>
        </div>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Tests: <span className="font-semibold">{passedCount}/{totalCount}</span>
          </span>
          {result.runtime > 0 && (
            <span className="flex items-center gap-1">
              <FiClock className="text-xs" /> {result.runtime}ms
            </span>
          )}
          {result.memory > 0 && (
            <span className="flex items-center gap-1">
              <FiCpu className="text-xs" /> {result.memory} KB
            </span>
          )}
        </div>
      </div>

      {result.testResults?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Test Cases</h4>
          <div className="space-y-2">
            {result.testResults.map((tc, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-xs font-mono ${tc.passed
                  ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
                  : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {tc.passed
                    ? <FiCheckCircle className="text-green-500 shrink-0" />
                    : <FiXCircle className="text-red-500 shrink-0" />
                  }
                  <span className="font-sans font-medium text-gray-700 dark:text-gray-300">
                    Test Case {tc.testCase}
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400 space-y-0.5 ml-5">
                  <div><span className="text-gray-400">Input:</span> {tc.input}</div>
                  <div><span className="text-gray-400">Expected:</span> {tc.expectedOutput}</div>
                  {!tc.passed && (
                    <div><span className="text-gray-400">Got:</span> <span className="text-red-500 dark:text-red-400">{tc.actualOutput || tc.error || 'No output'}</span></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemWorkspace;
