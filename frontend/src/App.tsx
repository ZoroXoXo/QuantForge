
import { useEffect, useState } from 'react'

import {
  Activity,
  BarChart3,
  FlaskConical,
  LayoutDashboard,
  Settings,
  ChevronDown,
  Zap,
  Database,
  CircleHelp,
} from 'lucide-react'

import SignalLab from './pages/SignalLab'
import Experiments from './pages/Experiments'


import {
  getExperimentStats,
  previewSignal,
  type ExperimentStats,
  type SignalResponse,
} from './services/api'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import './App.css'

type Page = 'dashboard' | 'signal-lab' | 'experiments'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [stats, setStats] = useState<ExperimentStats | null>(null)
  const [signalData, setSignalData] = useState<SignalResponse | null>(null)
  const [signalLoading, setSignalLoading] = useState(false)
  const [signalError, setSignalError] = useState('')

  async function loadDashboardSignal(
  isActive: () => boolean = () => true,
) {
  try {
    const result = await previewSignal({
      n: 1000,
      seed: 42,
      sideways_noise_std: 5,
      gaussian_kernel: 151,
      moving_average_window: 71,
    })

    if (isActive()) {
      setSignalData(result)
      setSignalError('')
    }
  } catch {
    if (isActive()) {
      setSignalError('Unable to load signal preview.')
    }
  } finally {
    if (isActive()) {
      setSignalLoading(false)
    }
  }
}
  const dashboardChartData = signalData
  ? signalData.time
      .filter((_, index) => index % 4 === 0)
      .map((time, index) => {
        const actualIndex = index * 4

        return {
          time,
          clean: signalData.clean_signal[actualIndex],
          noisy: signalData.noisy_signal[actualIndex],
          gaussian: signalData.gaussian_recovered[actualIndex],
          numerical: signalData.numerical_recovered[actualIndex],
        }
      })
  : []
  // Fetch dashboard statistics
  useEffect(() => {
  if (currentPage !== 'dashboard') return

  let cancelled = false

  getExperimentStats()
    .then((data) => {
      if (!cancelled) setStats(data)
    })
    .catch((error) => {
      if (!cancelled) {
        console.error('Failed to load dashboard stats:', error)
      }
    })

  const timer = window.setTimeout(() => {
    if (cancelled) return

    setSignalLoading(true)
    setSignalError('')
    void loadDashboardSignal(() => !cancelled)
  }, 0)

  return () => {
    cancelled = true
    window.clearTimeout(timer)
  }
}, [currentPage])
  // Dashboard metrics from the database
  const metrics = [
    {
      label: 'Experiments',
      value: stats ? stats.total_experiments.toLocaleString() : '—',
      change: 'Saved research runs',
      icon: FlaskConical,
    },
    {
      label: 'Best MSE',
      value: stats
        ? Math.min(
            stats.best_gaussian_mse,
            stats.best_numerical_mse,
          ).toFixed(4)
        : '—',
      change: 'Best recorded reconstruction',
      icon: Activity,
    },
    {
      label: 'Signals Processed',
      value: stats ? stats.total_samples.toLocaleString() : '—',
      change: 'Total samples processed',
      icon: BarChart3,
    },
    {
      label: 'Avg. Runtime',
      value: stats
        ? `${stats.average_runtime_ms.toFixed(2)} ms`
        : '—',
      change: 'Per experiment',
      icon: Zap,
    },
  ]

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={21} />
          </div>

          <span>
            Quant<span className="brand-accent">Forge</span>
          </span>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="nav-menu">
          {/* Dashboard */}
          <button
            className={`nav-item ${
              currentPage === 'dashboard' ? 'active' : ''
            }`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          {/* Signal Lab */}
          <button
            className={`nav-item ${
              currentPage === 'signal-lab' ? 'active' : ''
            }`}
            onClick={() => setCurrentPage('signal-lab')}
          >
            <FlaskConical size={18} />
            Signal Lab
          </button>

          {/* Experiments */}
          <button
            className={`nav-item ${
              currentPage === 'experiments' ? 'active' : ''
            }`}
            onClick={() => setCurrentPage('experiments')}
          >
            <BarChart3 size={18} />
            Experiments
          </button>

          <button className="nav-item" disabled>
            <Database size={18} />
            Datasets
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" disabled>
            <Settings size={18} />
            Settings
          </button>

          <button className="nav-item" disabled>
            <CircleHelp size={18} />
            Documentation
          </button>

          <div className="system-status">
            <span className="status-dot" />
            Research engine online
            <span className="status-version">v0.1</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace
            <span>/</span>

            {currentPage === 'dashboard'
              ? 'Dashboard'
              : currentPage === 'signal-lab'
                ? 'Signal Lab'
                : 'Experiments'}
          </div>

          <div className="profile">
            <div className="avatar">Q</div>
            <span>Researcher</span>
            <ChevronDown size={15} />
          </div>
        </header>

        <div className="page-content">
          {/* Signal Lab */}
          {currentPage === 'signal-lab' ? (
            <SignalLab />

          /* Experiments */
          ) : currentPage === 'experiments' ? (
            <Experiments />

          /* Dashboard */
          ) : (
            <>
              {/* Dashboard heading */}
              <section className="page-heading">
                <div>
                  <div className="eyebrow">RESEARCH OVERVIEW</div>
                  <h1>Dashboard</h1>

                  <p>
                    Monitor your quantitative research and signal processing
                    experiments.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setCurrentPage('signal-lab')}
                >
                  <FlaskConical size={16} />
                  New experiment
                </button>
              </section>

              {/* Metrics */}
              <section className="metrics-grid">
                {metrics.map((metric) => {
                  const Icon = metric.icon

                  return (
                    <div className="metric-card" key={metric.label}>
                      <div className="metric-top">
                        <span>{metric.label}</span>
                        <Icon size={18} />
                      </div>

                      <div className="metric-value">
                        {metric.value}
                      </div>

                      <div className="metric-change">
                        {metric.change}
                      </div>
                    </div>
                  )
                })}
              </section>

              {/* Research workspace */}
              <section className="section-heading">
                <div>
                  <h2>Research workspace</h2>
                  <p>Your signal analysis environment</p>
                </div>

                <span className="live-indicator">
                  <span />
                  SYSTEM READY
                </span>
              </section>

              <section className="workspace-grid">
                {/* Signal preview */}
                <div className="panel signal-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Signal analysis</h3>
                      <p>Signal generation and reconstruction</p>
                    </div>

                    <span className="panel-tag">SIGNAL LAB</span>
                  </div>

                  <div className="dashboard-live-chart">
            {signalLoading ? (
    <div className="experiment-message">
      Loading signal data...
    </div>
  ) : signalError ? (
    <div className="experiment-message">
      {signalError}
      <button
        className="primary-button"
        onClick={() => void loadDashboardSignal()}
      >
        Retry
      </button>
    </div>
  ) : signalData ? (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={dashboardChartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#293246"
        />

        <XAxis
          dataKey="time"
          stroke="#8993a7"
          tick={{ fontSize: 11 }}
        />

        <YAxis
          stroke="#8993a7"
          tick={{ fontSize: 11 }}
          width={50}
        />

        <Tooltip
          contentStyle={{
            background: '#151e2d',
            border: '1px solid #344157',
            borderRadius: '8px',
          }}
        />

        <Legend />

        <Line
          type="monotone"
          dataKey="clean"
          name="Clean"
          stroke="#34d399"
          dot={false}
          strokeWidth={2}
        />

        <Line
          type="monotone"
          dataKey="noisy"
          name="Noisy"
          stroke="#64748b"
          dot={false}
          strokeWidth={1}
        />

        <Line
          type="monotone"
          dataKey="gaussian"
          name="Gaussian"
          stroke="#38bdf8"
          dot={false}
          strokeWidth={2}
        />

        <Line
          type="monotone"
          dataKey="numerical"
          name="Numerical"
          stroke="#a78bfa"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  ) : null}
</div>

                  <div className="chart-note">
                    Live signal preview · 1,000 samples
                  </div>
                </div>

                {/* Quick actions */}
                <div className="panel activity-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Quick actions</h3>
                      <p>Continue your research</p>
                    </div>
                  </div>

                  <button
                    className="action-card"
                    onClick={() => setCurrentPage('signal-lab')}
                  >
                    <div className="action-icon">
                      <Activity size={19} />
                    </div>

                    <div>
                      <strong>Run signal analysis</strong>
                      <span>Generate and process a signal</span>
                    </div>

                    <span className="action-arrow">→</span>
                  </button>

                  <button
                    className="action-card"
                    onClick={() => setCurrentPage('signal-lab')}
                  >
                    <div className="action-icon purple">
                      <BarChart3 size={19} />
                    </div>

                    <div>
                      <strong>Compare filters</strong>
                      <span>Evaluate reconstruction methods</span>
                    </div>

                    <span className="action-arrow">→</span>
                  </button>

                  <button
                    className="action-card"
                    onClick={() => setCurrentPage('experiments')}
                  >
                    <div className="action-icon green">
                      <Database size={19} />
                    </div>

                    <div>
                      <strong>View experiments</strong>
                      <span>Explore signal analysis</span>
                    </div>

                    <span className="action-arrow">→</span>
                  </button>

                  <div className="backend-status">
                    <span className="status-dot" />

                    <div>
                      <strong>Backend connection</strong>
                      <small>FastAPI integration configured</small>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="footer">
                <span>
                  QUANTFORGE
                  <span className="footer-muted">
                    {' '}· Quantitative Research Platform
                  </span>
                </span>

                <span>Built for experimentation.</span>
              </footer>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
