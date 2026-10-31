import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export default api