import Repository from './repository'
import UseCase from './usecase'

const useCase = new UseCase(new Repository())

export default {
  data () {
    return {
      pageLimitCount: 20,
      pageNum: 1,
      clipboardItems: [],
      clipboardItemTotal: 0,
      keyword: null,
      tagList: [],
    }
  },
  methods: {
    async getClipboardItems () {
      const clipboardList = await useCase.getClipboard(this.pageNum, this.pageLimitCount, this.keyword)
      if (clipboardList != null) {
        this.clipboardItems = clipboardList.values
        this.clipboardItemTotal = clipboardList.total
      } else {
        this.clipboardItems = []
        this.clipboardItemTotal = 0
      }
    },
    async updateClipboardKeyword (keyword) {
      this.keyword = keyword
      // update
      await this.getClipboardItems()
    },
    async copyClipboard (clipboardItemId) {
      console.log('copyClipboard', clipboardItemId)
      await useCase.copyClipboard(clipboardItemId)
      // update
      await this.getClipboardItems()
    },
    async getTagList () {
      const tagList = await useCase.getTagList()
      if (tagList != null) {
        this.tagList = tagList
      } else {
        this.tagList = []
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