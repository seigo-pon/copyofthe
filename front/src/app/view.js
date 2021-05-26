import Repository from './repository'
import UseCase from './usecase'

const useCase = new UseCase(new Repository())

export default {
  data () {
    return {
      pageLimitCount: 20,
      pageNum: 1,
      requestId: null,
      clipboardItems: [],
      clipboardItemTotal: 0,
      keyword: null,
      filteringTag: null,
      filteringFavorite: false,
      filteringDate: null,
      lastTags: [],
      tagMaxLength: 30,
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
      const requestId = (new Date()).getTime()
      this.requestId = requestId

      const clipboardItems = await useCase.getClipboardItems(
        this.pageNum,
        this.pageLimitCount,
        this.keyword,
        (this.filteringTag != null) ? [this.filteringTag] : [],
        this.filteringFavorite,
        // msec -> sec
        (this.filteringDate != null) ? (this.filteringDate / 1000) : null
      )

      if (this.requestId != requestId) {
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
    async updateClipboardItems (keyword, tag, isFavorite, date) {
      console.log('updateClipboardItems', keyword, tag, isFavorite, date)
      this.keyword = keyword
      this.filteringTag = tag
      this.filteringFavorite = isFavorite
      this.filteringDate = (date != null) ? date.getTime() : null
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
      await this.getLastTags()
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