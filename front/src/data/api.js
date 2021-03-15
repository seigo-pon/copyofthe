import axios from 'axios'
import * as AxiosLogger from 'axios-logger'

// バックエンドアドレス
const baseUrl = process.env.VUE_APP_BASE_URL
console.log('baseUrl', baseUrl)

// axios初期化
const axiosClient = axios.create({
  baseURL: baseUrl
})
axiosClient.interceptors.request.use(
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger
)
axiosClient.interceptors.response.use(
  AxiosLogger.responseLogger,
  AxiosLogger.errorLogger
)

// api url
const apiUrl = 'api'
const clipboardApiUrl = `${apiUrl}/clipboard`
const tagApiUrl = `${apiUrl}/tag`
const clipboardCopyApiUrl = `${clipboardApiUrl}/copy`

class Api {
  constructor () {
  }

  async getClipboard (page, limit, key, tags) {
    try {
      let params = { page: page, limit: limit }
      if (key != null) {
        params.key = key
      }
      if (tags != null) {
        params.tags = tags
      }
      return await axiosClient.get(clipboardApiUrl, {params: params})
    } catch (err) {
      console.log('error', err)
      return null
    }
  }

  async getTag (key) {
    try {
      let params = {}
      if (key != null) {
        params.key = key
      }
      const res = await axiosClient.get(tagApiUrl, {params: params})
      return res.tags
    } catch (err) {
      console.log('error', err)
      return null
    }
  }
}

export default Api
