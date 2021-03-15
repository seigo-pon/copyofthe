import Api from './api'

const api = Api()

class UseCase {
  constructor() {
  }

  async getClipboard (page, limit, key, tags) {
    try {
      const tagList = await api.getTag()
      const clipboardResult = await api.getClipboard(page, limit, key, tags)
      return {
        values: clipboardResult.clipboard_values.map((v1) => {
          return {
            id: v1.uid,
            updatedAt: this.$moment(v1.updated_at),
            value: v1.value,
            tags: v1.tags.map((v2) => {
              return {
                id: v2.tag_uid,
                value: tagList.find((v3) => {
                  return v3.uid === v2.uid
                })
              }
            }),
            isFavorite: false,
            copiedCount: v1.copies.length,
          }
        }),
        total: clipboardResult.clipboard_total,
      }
    } catch (err) {
      console.log('error', err)
      return null
    }
  }
}

export default UseCase
