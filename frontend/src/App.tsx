
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
import { getExperimentStats, type ExperimentStats } from './services/api'

import './App.css'

type Page = 'dashboard' | 'signal-lab' | 'experiments'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [stats, setStats] = useState<ExperimentStats | null>(null)

  // Fetch dashboard statistics
  useEffect(() => {
  if (currentPage !== 'dashboard') return

  let cancelled = false

  getExperimentStats()
    .then((data) => {
      if (!cancelled) {
        setStats(data)
      }
    })
    .catch((error) => {
      console.error('Failed to load dashboard stats:', error)
    })

  return () => {
    cancelled = true
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

                  <div className="chart-placeholder">
                    <div className="chart-y-labels">
                      <span>100</span>
                      <span>50</span>
                      <span>0</span>
                      <span>-50</span>
                    </div>

                    <div className="chart-area">
                      <div className="chart-grid-lines">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>

                      <svg
                        viewBox="0 0 700 230"
                        preserveAspectRatio="none"
                      >
                        <polyline
                          points="0,160 25,145 50,155 75,120 100,135 125,100 150,115 175,90 200,110 225,75 250,95 275,70 300,85 325,110 350,125 375,105 400,145 425,130 450,160 475,145 500,175 525,155 550,185 575,170 600,195 625,180 650,205 675,190 700,200"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                        />

                        <polyline
                          points="0,165 25,155 50,145 75,135 100,125 125,115 150,105 175,95 200,90 225,85 250,80 275,82 300,90 325,100 350,110 375,120 400,130 425,140 450,150 475,160 500,170 525,180 550,190 575,195 600,200 625,205 650,208 675,210 700,212"
                          fill="none"
                          stroke="#a78bfa"
                          strokeWidth="2"
                          strokeDasharray="6 5"
                        />
                      </svg>

                      <div className="chart-x-labels">
                        <span>0</span>
                        <span>250</span>
                        <span>500</span>
                        <span>750</span>
                        <span>1000</span>
                      </div>
                    </div>
                  </div>

                  <div className="chart-legend">
                    <span>
                      <i className="legend-blue" />
                      Noisy signal
                    </span>

                    <span>
                      <i className="legend-purple" />
                      Reconstructed signal
                    </span>
                  </div>

                  <div className="chart-note">
                    Illustrative preview · Live API integration coming next
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
