<template>
  <div class="relative bg-white">
    <div class="flex justify-between items-center my-6">
      <div class="flex justify-between items-center w-full">
        <div class="flex">
          <span class="px-4 text-gray-700 text-xl">Searched result</span>
          <ClipboardFilterDate
            placeholderText="All Days"
            :initalDate="getFilteredDate"
            @update-date="updateFilteredDate"
          />
        </div>
        <clipboard-item-count
          :clipboardItemTotal="clipboardItemTotal"
          :pageLimitCount="pageLimitCount"
          :pageNum="pageNum"
          @prev-page="updatePage"
          @next-page="updatePage"
        />
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
  name: 'ClipboardResult',
  components: {
    ClipboardFilterDate,
    ClipboardItem,
    ClipboardItemCount,
  },
  data () {
    return {
      pageLimitCount: 20,
      pageNum: 0,
      clipboardItems: [],
      clipboardItemTotal: 0,
    }
  },
  mounted () {
    const keyword = decodeURI(this.$route.query.keyword)
    this.fetchClipboardItems(keyword)
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
  watch: {
    '$route.query' (v1, v2) {
      if (v1.keyword != undefined && v1.keyword != v2.keyword) {
        const keyword = decodeURI(v1.keyword)
        this.fetchClipboardItems(keyword)
      }
    },
  },
  methods: {
    fetchClipboardItems (keyword) {
      console.log(keyword)

      this.clipboardItems = []

      this.clipboardItems.push({
        id: '1',
        updatedAt: this.$moment(),
        value: 'First Value',
        tags: [],
        isFavorite: false,
        copiedCount: 0,
      })
      this.clipboardItems.push({
        id: '2',
        updatedAt: this.$moment(),
        value: 'Second Value',
        tags: [{ id: '1', value: '1 item'}, { id: '2', value: '2 item'}],
        isFavorite: false,
        copiedCount: 0,
      })
    },
    checkClipboardItems () {
      if (this.clipboardItems.length === 0) {
        const path = '/clipboard/notfound'
        if (this.$route.query.date) {
          this.$router.push({ path: path, query: { date: this.$route.query.date } })
            .catch(() => {})
        } else {
          this.$router.push(path)
            .catch(() => {})
        }
      }
    },
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
    updatePage (e) {
      this.pageNum = e
    },
  },
}
</script>
<style scoped>
</style>
