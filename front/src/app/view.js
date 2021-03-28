import Repository from './repository'
import UseCase from './usecase'

const useCase = new UseCase(new Repository())

export default {
  data () {
    return {
      pageId: null,
      pageLimitCount: 20,
      pageNum: 1,
      clipboardItems: [],
      clipboardItemTotal: 0,
      keyword: null,
      filteredDate: null,
      lastTags: [],
    }
  },
  created () {
    this.pageId = (new Date()).getTime()
  },
  methods: {
    async getClipboardItems () {
      const pageId = this.pageId

      const clipboardItems = await useCase.getClipboardItems(
        this.pageNum,
        this.pageLimitCount,
        this.keyword,
        (this.filteredDate / 1000)  // msec -> sec
      )

      if (this.pageId != pageId) {
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
      this.filteredDate = date ? date.getTime() : null
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