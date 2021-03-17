import axios from 'axios'
import * as AxiosLogger from 'axios-logger'

// axios初期化
const axiosClient = axios.create()
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
// const clipboardCopyApiUrl = `${clipboardApiUrl}/copy`

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
      const response = await axiosClient.get(clipboardApiUrl, {params: params})
      return response.data
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
      const response = await axiosClient.get(tagApiUrl, {params: params})
      return response.data.tags
    } catch (err) {
      console.log('error', err)
      return null
    }
  }
}

export default Api
