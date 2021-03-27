import moment from 'moment'

class UseCase {
  constructor(repository) {
    this.repository = repository
  }

  async getClipboard (page, limit, key, tags) {
    try {
      const tagList = await this.repository.getTag()
      const clipboardResult = await this.repository.getClipboard(page, limit, key, tags)
      return {
        values: clipboardResult.clipboard_values.map((v1) => {
          return {
            id: v1.uid,
            updatedAt: moment(v1.updated_at),
            value: v1.value,
            tags: v1.tags.map((v2) => {
              return {
                id: v2.tag_uid,
                value: tagList.find((v3) => {
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

  async copyClipboard (clipboardItem) {
    try {
      await this.repository.copyClipboard(clipboardItem.id)
    } catch (err) {
      console.log('error', err)
    }
  }

  async getTagList () {
    try {
      const tagList = await this.repository.getTag()
      return tagList.map((v) => {
          return {
            id: v.id,
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
      let tagList = await this.repository.getTag()
      let tag = tagList.find((v) => {
        return v.value === tagValue
      })
      if (tag == null) {
        await this.repository.addTag(tagValue)
        tagList = await this.repository.getTag()
        tag = tagList.find((v) => {
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
