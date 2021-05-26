import moment from 'moment'

class UseCase {
  constructor(repository) {
    this.repository = repository
  }

  async getClipboardItems (page, limit, key, tags, isFavorite, date) {
    try {
      const lastTags = await this.repository.getTag()
      let tagIds = null
      if (tags != null && tags.length > 0) {
        tagIds = tags.map((v1) => {
          return lastTags.find((v2) => {
            return v2.value === v1
          }).uid
        })
      }
      const clipboardResult = await this.repository.getClipboard(page, limit, key, tagIds, isFavorite, date)
      return {
        values: clipboardResult.clipboard_values.map((v1) => {
          return {
            id: v1.uid,
            updatedAt: moment(v1.updated_at),
            value: v1.value,
            tags: v1.tags.map((v2) => {
              return {
                id: v2.tag_uid,
                value: lastTags.find((v3) => {
                  return v3.uid === v2.tag_uid
                }).value
              }
            }),
            isFavorite: (v1.is_favorite != null),
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

  async copyClipboardItem (clipboardItem) {
    try {
      await this.repository.copyClipboard(clipboardItem.id)
    } catch (err) {
      console.log('error', err)
    }
  }

  async getLastTags () {
    try {
      const lastTags = await this.repository.getTag()
      return lastTags.map((v) => {
          return {
            id: v.uid,
            value: v.value
          }
        })
    } catch (err) {
      console.log('error', err)
      return null
    }
  }

  async removeClipboardTag (clipboardItem, tagId) {
    try {
      const tags = clipboardItem.tags.filter((v) => {
        return v.id != tagId
      }).map((v) => {
        return v.id
      })

      await this.repository.setClipboard(clipboardItem.id, tags)
    } catch (err) {
      console.log('error', err)
    }
  }

  async addClipboardTag (clipboardItem, tagValue) {
    try {
      let lastTags = await this.repository.getTag()
      let tag = lastTags.find((v) => {
        return v.value === tagValue
      })
      if (tag == null) {
        await this.repository.addTag(tagValue)
        lastTags = await this.repository.getTag()
        tag = lastTags.find((v) => {
          return v.value === tagValue
        })
        if (tag == null) {
          console.log('add tag error', tagValue)
          return
        }
      }

      let tags = clipboardItem.tags.map((v) => {
        return v.id
      })
      if (tags.findIndex((v) => {
        return v === tag.uid
      }) != -1) {
        console.log('exist tag error', tagValue)
        return
      }
      tags.push(tag.uid)

      await this.repository.setClipboard(clipboardItem.id, tags)
    } catch (err) {
      console.log('error', err)
    }
  }

  async updateFavoriteClipboard (clipboardItem, isFavorite) {
    try {
      await this.repository.setClipboard(clipboardItem.id, null, isFavorite)
    } catch (err) {
      console.log('error', err)
    }
  }

  async removeClipboard (clipboardItem) {
    try {
      await this.repository.removeClipboard(clipboardItem.id)
    } catch (err) {
      console.log('error', err)
    }
  }
}

export default UseCase
