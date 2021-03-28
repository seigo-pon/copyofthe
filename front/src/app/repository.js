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
const clipboardCopyApiUrl = `${clipboardApiUrl}/copy`

class Repository {
  constructor () {
  }

  async getClipboard (page, limit, key, date, tags) {
    try {
      let params = { page: page, limit: limit }
      if (key != null) {
        params.key = key
      }
      if (date != null) {
        params.date = date
      }
      if (tags != null) {
        params.tags = tags
      }
      console.log('getClipboard', params)

      const response = await axiosClient.get(clipboardApiUrl, { params: params })
      return response.data
    } catch (err) {
      console.log('error', err)
      return null
    }
  }

  async setClipboard (clipboardUid, tags, isFavorite) {
    try {
      let params = new URLSearchParams()
      params.append('clipboard_uid', clipboardUid)
      if (tags != null) {
        tags.forEach((v) => {
          params.append('tags', v)
        })
      }
      if (isFavorite != null) {
        params.append('is_favorite', isFavorite ? 1 : 0)
      }

      const response = await axiosClient.post(clipboardApiUrl, params)
      return response.data
    } catch (err) {
      console.log('error', err)
      return null
    }
  }

  async removeClipboard (clipboardUid) {
    try {
      const params = { 'clipboard_uid': clipboardUid }

      const response = await axiosClient.delete(clipboardApiUrl, { params: params })
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

      const response = await axiosClient.get(tagApiUrl, { params: params })
      return response.data.tags
    } catch (err) {
      console.log('error', err)
      return null
    }
  }

  async addTag (tag) {
    try {
      let params = new URLSearchParams()
      params.append('tag', tag)

      const response = await axiosClient.post(tagApiUrl, params)
      return response.data.tags
    } catch (err) {
      console.log('error', err)
      return null
    }
  }

  async copyClipboard (clipboardUid) {
    try {
      let params = new URLSearchParams()
      params.append('clipboard_uid', clipboardUid)

      const response = await axiosClient.post(clipboardCopyApiUrl, params)
      return response.data.tags
    } catch (err) {
      console.log('error', err)
      return null
    }
  }
}

export default Repository
