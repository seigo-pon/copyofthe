import UseCase from '../repository/usecase'

const useCase = new UseCase()

export default {
  data () {
    return {
      pageLimitCount: 20,
      pageNum: 1,
      clipboardItems: [],
      clipboardItemTotal: 0,
    }
  },
  methods: {
    async getClipboardItems (key) {
      const ret = await useCase.getClipboard(this.pageNum, this.pageLimitCount, key)
      if (ret != null) {
        this.clipboardItems = ret.values
        this.clipboardItemTotal = ret.total
      }
    },
    removeTag (clipboardItemId, tagId) {
      console.log('removeTag', clipboardItemId, tagId)
    },
    addTag (clipboardItemId, tagValue) {
      console.log('addTag', clipboardItemId, tagValue)
    },
    updateFavorite (clipboardItemId) {
      console.log('updateFavorite', clipboardItemId)
    },
    updatePage (e) {
      console.log('updatePage', e)
      this.pageNum = e
    },
  },
}