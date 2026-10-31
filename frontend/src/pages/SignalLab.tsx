import { useState } from 'react'
import {
  Activity,
  Play,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { generateSignal } from '../services/api'
import type { SignalResponse } from '../services/api'

export default function SignalLab() {
  const [samples, setSamples] = useState(1000)
  const [seed, setSeed] = useState(42)
  const [noise, setNoise] = useState(5)
  const [gaussianKernel, setGaussianKernel] = useState(151)
  const [movingAverageWindow, setMovingAverageWindow] = useState(71)

  const [result, setResult] = useState<SignalResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setLoading(true)
    setError('')

    try {
      const data = await generateSignal({
        n: samples,
        seed,
        sideways_noise_std: noise,
        gaussian_kernel: gaussianKernel,
        moving_average_window: movingAverageWindow,
      })

      setResult(data)
    } catch (err) {
      console.error(err)
      setError('Could not generate signal. Check that the FastAPI backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const chartData = result
    ? result.time.map((t, i) => ({
        time: t,
        clean: result.clean_signal[i],
        noisy: result.noisy_signal[i],
        gaussian: result.gaussian_recovered[i],
        numerical: result.numerical_recovered[i],
      }))
    : []

  const chartConfigs = [
    { key: 'clean', label: 'Clean signal', color: '#34d399' },
    { key: 'noisy', label: 'Noisy signal', color: '#38bdf8' },
    { key: 'gaussian', label: 'Gaussian recovery', color: '#a78bfa' },
    { key: 'numerical', label: 'Numerical recovery', color: '#fbbf24' },
  ] as const

  const metricCards = result
    ? [
        { label: 'Noisy MSE', value: result.metrics.noisy_mse },
        { label: 'Gaussian MSE', value: result.metrics.gaussian_mse },
        { label: 'Numerical MSE', value: result.metrics.numerical_mse },
      ]
    : []

  return (
    <div className="signal-lab">
      <div className="lab-heading">
        <div>
          <div className="eyebrow">RESEARCH ENVIRONMENT</div>
          <h1>Signal Lab</h1>
          <p>Generate, process and compare synthetic financial signals.</p>
        </div>
        <div className="lab-status">
          <span className="status-dot" /> API CONNECTED
        </div>
      </div>

      <div className="lab-layout">
        <section className="panel controls-panel">
          <div className="panel-heading">
            <div>
              <h3>Signal configuration</h3>
              <p>Configure your experiment parameters</p>
            </div>
            <Activity size={19} color="#38bdf8" />
          </div>

          <div className="control-group">
            <label htmlFor="samples">Sample count</label>
            <div className="control-value">{samples}</div>
            <input
              id="samples"
              type="range"
              min="200"
              max="2000"
              step="100"
              value={samples}
              onChange={(e) => setSamples(Number(e.target.value))}
            />
            <div className="range-labels"><span>200</span><span>2000</span></div>
          </div>

          <div className="control-group">
            <label htmlFor="seed">Random seed</label>
            <input
              id="seed"
              type="number"
              value={seed}
              min="0"
              onChange={(e) => setSeed(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label htmlFor="noise">Sideways noise level</label>
            <div className="control-value">{noise.toFixed(1)}</div>
            <input
              id="noise"
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={noise}
              onChange={(e) => setNoise(Number(e.target.value))}
            />
            <div className="range-labels"><span>1.0</span><span>10.0</span></div>
          </div>

          <div className="control-group">
            <label htmlFor="gaussian">Gaussian kernel</label>
            <select
              id="gaussian"
              value={gaussianKernel}
              onChange={(e) => setGaussianKernel(Number(e.target.value))}
            >
              {[3, 5, 11, 21, 51, 71, 101, 121, 151, 181, 201].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="moving-average">Moving average window</label>
            <select
              id="moving-average"
              value={movingAverageWindow}
              onChange={(e) => setMovingAverageWindow(Number(e.target.value))}
            >
              {[3, 5, 11, 21, 31, 51, 71, 101].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <button
            className="primary-button generate-button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
            {loading ? 'Generating...' : 'Generate signal'}
          </button>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </section>

        <div className="lab-results">
          <section className="metrics-grid lab-metrics">
            {metricCards.length > 0 ? (
              metricCards.map((metric) => (
                <div className="metric-card" key={metric.label}>
                  <div className="metric-top">{metric.label}</div>
                  <div className="metric-value">{metric.value.toFixed(4)}</div>
                  <div className="metric-change">Mean squared error</div>
                </div>
              ))
            ) : (
              <div className="empty-metrics">
                Configure your parameters and generate a signal to see metrics.
              </div>
            )}
          </section>

          <section className="panel results-panel">
            <div className="panel-heading">
              <div>
                <h3>Signal visualization</h3>
                <p>
                  {result
                    ? `${result.parameters.samples} samples · Seed ${result.parameters.seed}`
                    : 'Waiting for your first experiment'}
                </p>
              </div>
              <span className="panel-tag">LIVE RESULTS</span>
            </div>

            {result ? (
              <div className="charts-grid">
                {chartConfigs.map((chart) => (
                  <div className="signal-chart" key={chart.key}>
                    <div className="chart-title">
                      <span style={{ background: chart.color }} />
                      {chart.label}
                    </div>
                    <ResponsiveContainer width="100%" height={190}>
                      <LineChart data={chartData}>
                        <CartesianGrid stroke="#293646" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="time"
                          tick={{ fill: '#8190a3', fontSize: 9 }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: '#8190a3', fontSize: 9 }}
                          tickLine={false}
                          width={40}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#101823',
                            border: '1px solid #293646',
                            borderRadius: 7,
                            fontSize: 11,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey={chart.key}
                          stroke={chart.color}
                          dot={false}
                          strokeWidth={1.7}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Activity size={35} />
                <h3>No signal generated yet</h3>
                <p>Your signal charts will appear here after generation.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}