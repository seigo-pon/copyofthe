<template>
  <div class="relative bg-white">
    <div class="flex justify-between items-center my-6">
      <div class="flex justify-between items-center w-full">
        <ClipboardFilterDate
          placeholderText="Latest"
          :initalDate="getFilteredDate"
          @update-date="updateFilteredDate"
        />
        <clipboard-item-count :pageLimitCount="pageLimitCount" :clipboardItemCount="clipboardItems.length" />
      </div>
    </div>
    <div class="my-4">
      <ul class="list-none">
        <template v-for="clipboardItem in clipboardItems">
          <ClipboardItem
            :key="clipboardItem.id"
            :clipboard-item="clipboardItem"
            @remove-tag="removeTag"
            @add-tag="addTag"
          />
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import ClipboardFilterDate from './ClipboardFilterDate.vue'
import ClipboardItem from './ClipboardItem.vue'
import ClipboardItemCount from './ClipboardItemCount.vue'

export default {
  name: 'ClipboardHistory',
  components: {
    ClipboardFilterDate,
    ClipboardItem,
    ClipboardItemCount,
  },
  data () {
    return {
      pageLimitCount: 20,
      clipboardItems: [],
    }
  },
  mounted () {
    setTimeout(() => {
      this.clipboardItems.push({
        id: '1',
        updatedAt: this.$moment(),
        value: 'First Value',
        tags: [],
        isFavorite: false,
        copiedCount: 0,
      })
    }, 100)
    setTimeout(() => {
      this.clipboardItems.push({
        id: '2',
        updatedAt: this.$moment(),
        value: 'Second Value',
        tags: [{ id: '1', value: '1 item'}, { id: '2', value: '2 item'}],
        isFavorite: false,
        copiedCount: 0,
      })
    }, 200)
  },
  computed: {
    getFilteredDate () {
      if (this.$route.query.date) {
        return new Date(Number(this.$route.query.date))
      } else {
        return null
      }
    },
  },
  methods: {
    updateFilteredDate (date) {
      if (date != null) {
        this.$router.push({ path: this.$route.path, query: {date: date.getTime()} })
          .catch(() => {})
      } else {
        this.$router.push({ path: this.$route.path })
          .catch(() => {})
      }
    },
    removeTag (clipboardItemId, tagId) {
      console.log(clipboardItemId, tagId)
    },
    addTag (clipboardItemId, tagValue) {
      console.log(clipboardItemId, tagValue)
    },
    // renderTags (h, params) {
    //   return h('div', [
    //     params.item.tags.map((v) => {
    //       return h('AtTag', {
    //         props: {
    //           name: v,
    //         },
    //         on: {
    //           close: () => {
    //             const index = params.item.tags.findIndex((v1) => {
    //               return v1 === v
    //             })
    //             params.item.tags.splice(index, 1)
    //             this.clipboardItems[params.index] = params.item
    //           },
    //         },
    //       }, v)
    //     }),
    //   ])
    // },
    // renderUpdateTag (h, params) {
    //   return h('div', [
    //     h('AtButton', {
    //       props: {
    //         type: 'primary',
    //         hollow: true,
    //         circle: true,
    //         icon: 'icon-tag',
    //       },
    //       style: {
    //       },
    //       on: {
    //         click: () => {
    //           this.addingTagClipboardIndex = this.clipboardItems.findIndex((v) => {
    //             return v.createdAt === params.item.createdAt
    //           })
    //           this.addingTagIndexList = params.item.tags.map((v) => {
    //             return this.masterTagList.findIndex((v2) => {
    //               return v === v2
    //             })
    //           })
    //           this.showAddTagModal = true
    //         },
    //       },
    //     }),
    //   ])
    // },
    // renderAction (h, params) {
    //   return h('div', [
    //     h('AtBadge', {
    //       props: {
    //         status: 'info',
    //         show: params.item.copiedCount > 0,
    //         value: params.item.copiedCount,
    //       },
    //       style: {
    //         marginRight: '16px',
    //       },
    //     }, [
    //       h('AtButton', {
    //         props: {
    //           type: 'primary',
    //           hollow: true,
    //           size: 'small',
    //           icon: 'icon-clipboard',
    //         },
    //         on: {
    //           click: () => {
    //             params.item.copiedCount += 1
    //             params.item.lastCopiedAt = this.$moment().format('YYYY/MM/DD HH:mm:ss')
    //             this.clipboardItems[params.index] = params.item

    //             this.$Message.success('Copied')
    //           },
    //         },
    //       }),
    //     ]),
    //     h('AtButton', {
    //       props: {
    //         type: 'error',
    //         hollow: true,
    //         size: 'small',
    //         icon: 'icon-x',
    //       },
    //       on: {
    //         click: () => {
    //           this.$Modal.confirm({
    //             title: 'Remove comfirmation',
    //             content: 'Remove this value permanently?'
    //           }).then(() => {
    //             this.clipboardItems.splice(params.index, 1)
    //             this.$Message.success('Succeed to remove')
    //           }).catch(() => {
    //             console.log('remove canceled')
    //           })
    //         },
    //       },
    //     }),
    //   ])
    // },
    // removeAll () {
    //   this.$Modal.confirm({
    //     title: 'Remove comfirmation',
    //     content: 'Remove these shown values permanently?'
    //   }).then(() => {
    //     this.clipboardItems = []
    //     this.$Message.success('Removed all')
    //   }).catch(() => {
    //     console.log('remove all canceled')
    //   })
    // },
    // addTag () {
    //   const tags = this.addingTagIndexList.map((v) => {
    //     return this.masterTagList[v]
    //   })
    //   this.clipboardItems[this.addingTagClipboardIndex].tags = tags
    //   const value = this.clipboardItems[this.addingTagClipboardIndex]
    //   this.clipboardItems.splice(this.addingTagClipboardIndex, 1, value)

    //   this.addingTagClipboardIndex = null
    //   this.addingTagIndexList = []
    //   this.newTag = ''
    // },
    // addNewTag () {
    //   const newTag = this.newTag.toLowerCase()
    //   const index = this.masterTagList.findIndex((v) => {
    //     return v.toLowerCase() === newTag
    //   })
    //   if (index === -1) {
    //     this.masterTagList.push(newTag)
    //     this.addingTagIndexList.push(this.masterTagList.length - 1)
    //     this.newTag = ''
    //   }
    // },
    // removeTag (tag) {
    //   const index = this.addingTagIndexList.findIndex((v) => {
    //     return this.masterTagList[v] === tag
    //   })
    //   this.addingTagIndexList.splice(index, 1)
    // },
  },
}
</script>
<style scoped>
</style>
