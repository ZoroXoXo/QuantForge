
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Signal generation

export interface SignalRequest {
  n: number
  seed: number
  sideways_noise_std: number
  gaussian_kernel: number
  moving_average_window: number
}

export interface SignalResponse {
  time: number[]
  clean_signal: number[]
  noisy_signal: number[]
  gaussian_recovered: number[]
  numerical_recovered: number[]
  regimes: string[]
  metrics: {
    noisy_mse: number
    gaussian_mse: number
    numerical_mse: number
  }
  parameters: {
    samples: number
    seed: number
    sideways_noise_std: number
    gaussian_kernel: number
    moving_average_window: number
  }
  experiment_id: number
  runtime_ms: number
}

// Experiment history

export interface Experiment {
  id: number
  created_at: string
  samples: number
  seed: number
  sideways_noise_std: number
  gaussian_kernel: number
  moving_average_window: number
  noisy_mse: number
  gaussian_mse: number
  numerical_mse: number
  runtime_ms: number
}


export interface ExperimentStats {
  total_experiments: number
  total_samples: number
  best_gaussian_mse: number
  best_numerical_mse: number
  average_runtime_ms: number
  average_gaussian_mse: number
  average_numerical_mse: number
}
// API functions
export async function getExperimentStats(): Promise<ExperimentStats> {
  const response = await api.get<ExperimentStats>(
    '/api/v1/experiments/stats',
  )

  return response.data
}

export async function generateSignal(
  params: SignalRequest,
): Promise<SignalResponse> {
  const response = await api.post<SignalResponse>(
    '/api/v1/signals/generate',
    params,
  )

  return response.data
}

export async function getExperiments(): Promise<Experiment[]> {//fetch all saved runs
  const response = await api.get<Experiment[]>('/api/v1/experiments/')
  return response.data
}

export async function getExperiment(id: number): Promise<Experiment> {//fetch one run
  const response = await api.get<Experiment>(`/api/v1/experiments/${id}`)
  return response.data
}

export async function deleteExperiment(id: number): Promise<void> {// del saved run
  await api.delete(`/api/v1/experiments/${id}`)
}

export default api
