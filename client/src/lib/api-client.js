import axios from 'axios'
import { BACKEND_URL } from '@/utils/constants'

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
})