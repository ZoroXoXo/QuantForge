
import { useEffect, useState } from 'react'
import {
  RefreshCw,
  Trash2,
  Eye,
  FlaskConical,
  AlertCircle,
  X,
} from 'lucide-react'

import {
  getExperiments,
  getExperiment,
  deleteExperiment,
  type Experiment,
} from '../services/api'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'


function Experiments() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [selected, setSelected] = useState<Experiment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadExperiments() {
    try {
      setLoading(true)
      setError('')
      const data = await getExperiments()
      setExperiments(data)
    } catch {
      setError('Unable to load experiments. Check your backend connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  let cancelled = false

  getExperiments()
    .then((data) => {
      if (!cancelled) {
        setExperiments(data)
      }
    })
    .catch(() => {
      if (!cancelled) {
        setError('Unable to load experiments. Check your backend connection.')
      }
    })
    .finally(() => {
      if (!cancelled) {
        setLoading(false)
      }
    })

  return () => {
    cancelled = true
  }
}, [])
  const chartData = experiments.map((experiment) => ({
  name: `#${experiment.id}`,
  Noisy: experiment.noisy_mse,
  Gaussian: experiment.gaussian_mse,
  Numerical: experiment.numerical_mse,
}))

  async function handleView(id: number) {
    try {
      const data = await getExperiment(id)
      setSelected(data)
    } catch {
      setError(`Unable to retrieve experiment #${id}.`)
    }
  }

  

  async function handleDelete(id: number) {
    if (!window.confirm(`Delete experiment #${id}? This cannot be undone.`)) {
      return
    }

    try {
      await deleteExperiment(id)
      setExperiments((previous) =>
        previous.filter((experiment) => experiment.id !== id),
      )

      if (selected?.id === id) {
        setSelected(null)
      }
    } catch {
      setError(`Unable to delete experiment #${id}.`)
    }
  }

  return (
    <div className="experiments-page">
      <section className="page-heading">
        <div>
          <div className="eyebrow">RESEARCH HISTORY</div>
          <h1>Experiments</h1>
          <p>Review and manage your saved signal processing experiments.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => void loadExperiments()}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </section>

      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span>Total experiments</span>
            <FlaskConical size={18} />
          </div>
          <div className="metric-value">{experiments.length}</div>
          <div className="metric-change">Saved research runs</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Best Gaussian MSE</span>
          </div>
          <div className="metric-value">
            {experiments.length
              ? Math.min(...experiments.map((e) => e.gaussian_mse)).toFixed(4)
              : '—'}
          </div>
          <div className="metric-change">Lowest recorded value</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Best Numerical MSE</span>
          </div>
          <div className="metric-value">
            {experiments.length
              ? Math.min(...experiments.map((e) => e.numerical_mse)).toFixed(4)
              : '—'}
          </div>
          <div className="metric-change">Lowest recorded value</div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span>Average runtime</span>
          </div>
          <div className="metric-value">
            {experiments.length
              ? (
                  experiments.reduce((sum, e) => sum + e.runtime_ms, 0) /
                  experiments.length
                ).toFixed(2) + ' ms'
              : '—'}
          </div>
          <div className="metric-change">Across saved runs</div>
        </div>
      </section>
      <section className="panel experiments-chart-panel">
  <div className="panel-heading">
    <div>
      <h3>Reconstruction error comparison</h3>
      <p>MSE comparison across saved experiments</p>
    </div>
    <span className="panel-tag">LOWER IS BETTER</span>
  </div>

  {experiments.length > 0 ? (
    <div className="experiments-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#293246" />
          <XAxis dataKey="name" stroke="#8993a7" />
          <YAxis stroke="#8993a7" />
          <Tooltip
            contentStyle={{
              background: '#151e2d',
              border: '1px solid #344157',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="Noisy" fill="#64748b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Gaussian" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Numerical" fill="#a78bfa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <div className="experiment-message">
      No experiment data available.
    </div>
  )}
</section>
      {error && (
        <div className="experiment-error">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <section className="panel experiments-panel">
        <div className="panel-heading">
          <div>
            <h3>Experiment history</h3>
            <p>All saved signal generation and filtering runs</p>
          </div>
          <span className="panel-tag">{experiments.length} RECORDS</span>
        </div>

        {loading ? (
          <div className="experiment-message">
            <RefreshCw size={20} />
            Loading experiments...
          </div>
        ) : experiments.length === 0 ? (
          <div className="experiment-message">
            <FlaskConical size={28} />
            <strong>No experiments yet</strong>
            <span>Generate a signal in Signal Lab to create your first record.</span>
          </div>
        ) : (
          <div className="experiments-table-wrapper">
            <table className="experiments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Samples</th>
                  <th>Noise</th>
                  <th>Gaussian MSE</th>
                  <th>Numerical MSE</th>
                  <th>Runtime</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {experiments.map((experiment) => (
                  <tr key={experiment.id}>
                    <td>#{experiment.id}</td>
                    <td>
                      {new Date(experiment.created_at).toLocaleString()}
                    </td>
                    <td>{experiment.samples.toLocaleString()}</td>
                    <td>{experiment.sideways_noise_std}</td>
                    <td>{experiment.gaussian_mse.toFixed(4)}</td>
                    <td>{experiment.numerical_mse.toFixed(4)}</td>
                    <td>{experiment.runtime_ms.toFixed(2)} ms</td>
                    <td>
                      <div className="experiment-actions">
                        <button
                          className="icon-button"
                          title="View details"
                          onClick={() => void handleView(experiment.id)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="icon-button danger"
                          title="Delete experiment"
                          onClick={() => void handleDelete(experiment.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected && (
        <div className="experiment-modal-backdrop">
          <div className="experiment-modal">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">EXPERIMENT DETAILS</div>
                <h3>Experiment #{selected.id}</h3>
              </div>

              <button
                className="icon-button"
                onClick={() => setSelected(null)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="experiment-details-grid">
              <div>
                <span>Samples</span>
                <strong>{selected.samples}</strong>
              </div>
              <div>
                <span>Seed</span>
                <strong>{selected.seed}</strong>
              </div>
              <div>
                <span>Noise std</span>
                <strong>{selected.sideways_noise_std}</strong>
              </div>
              <div>
                <span>Gaussian kernel</span>
                <strong>{selected.gaussian_kernel}</strong>
              </div>
              <div>
                <span>Moving average window</span>
                <strong>{selected.moving_average_window}</strong>
              </div>
              <div>
                <span>Runtime</span>
                <strong>{selected.runtime_ms.toFixed(2)} ms</strong>
              </div>
              <div>
                <span>Noisy MSE</span>
                <strong>{selected.noisy_mse.toFixed(6)}</strong>
              </div>
              <div>
                <span>Gaussian MSE</span>
                <strong>{selected.gaussian_mse.toFixed(6)}</strong>
              </div>
              <div>
                <span>Numerical MSE</span>
                <strong>{selected.numerical_mse.toFixed(6)}</strong>
              </div>
            </div>

            <p className="experiment-modal-date">
              Created: {new Date(selected.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Experiments
