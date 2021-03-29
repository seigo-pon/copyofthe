import Repository from './repository'
import UseCase from './usecase'

const useCase = new UseCase(new Repository())

export default {
  data () {
    return {
      pageLimitCount: 20,
      pageNum: 1,
      reqId: null,
      clipboardItems: [],
      clipboardItemTotal: 0,
      keyword: null,
      filteredDate: null,
      lastTags: [],
    }
  },
  created () {
  },
  watch: {
    keyword (v) {
      console.log('keyword', v)
    },
  },
  methods: {
    async getClipboardItems () {
      const reqId = (new Date()).getTime()
      this.reqId = reqId

      const clipboardItems = await useCase.getClipboardItems(
        this.pageNum,
        this.pageLimitCount,
        this.keyword,
        // msec -> sec
        (this.filteredDate != null) ? (this.filteredDate / 1000) : null
      )

      if (this.reqId != reqId) {
        console.log('getClipboardItems: no need request')
        return
      }

      if (clipboardItems != null) {
        this.clipboardItems = clipboardItems.values
        this.clipboardItemTotal = clipboardItems.total
      } else {
        this.clipboardItems = []
        this.clipboardItemTotal = 0
      }
    },
    async updateClipboardItems (keyword, date) {
      console.log('updateClipboardItems', keyword, date)
      this.keyword = keyword
      this.filteredDate = (date != null) ? date.getTime() : null
      // update
      await this.getClipboardItems()
    },
    async copyClipboardItem (clipboardItem) {
      console.log('copyClipboard', clipboardItem)
      await useCase.copyClipboardItem(clipboardItem)
      // update
      await this.getClipboardItems()
    },
    async getLastTags () {
      const lastTags = await useCase.getLastTags()
      if (lastTags != null) {
        this.lastTags = lastTags
      } else {
        this.lastTags = []
      }
    },
    async removeClipboardTag (clipboardItem, tagId) {
      console.log('removeClipboardTag', clipboardItem, tagId)
      await useCase.removeClipboardTag(clipboardItem, tagId)
      // update
      await this.getClipboardItems()
    },
    async addClipboardTag (clipboardItem, tagValue) {
      console.log('addClipboardTag', clipboardItem, tagValue)
      await useCase.addClipboardTag(clipboardItem, tagValue)
      // update
      await this.getClipboardItems()
    },
    async updateFavoriteClipboard (clipboardItem) {
      console.log('updateFavoriteClipboard', clipboardItem)
      await useCase.updateFavoriteClipboard(clipboardItem, !clipboardItem.isFavorite)
      // update
      await this.getClipboardItems()
    },
    async removeClipboard (clipboardItem) {
      console.log('removeClipboard', clipboardItem)
      await useCase.removeClipboard(clipboardItem)
      // update
      await this.getClipboardItems()
    },
    updatePage (e) {
      console.log('updatePage', e)
      this.pageNum = e
    },
  },
}