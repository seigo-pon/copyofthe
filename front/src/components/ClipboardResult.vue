<template>
  <div class="relative bg-white">
    <div class="flex justify-between items-center my-6">
      <div class="flex justify-between items-center w-full">
        <div class="flex">
          <span class="px-4 text-gray-700 text-xl">Searched result</span>
          <ClipboardFilterDate
            placeholderText="All Days"
            :initalDate="getFilteredDate($route.query.date)"
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
            @copy-clipboard="copyClipboardItem"
            @remove-clipboard-tag="removeClipboardTag"
            @add-clipboard-tag="addClipboardTag"
            @update-favorite-clipboard="updateFavoriteClipboard"
            @remove-clipboard="removeClipboard"
          />
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import ClipboardTable from './clipboardtable'
import View from '../app/view'
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
  mixins: [View, ClipboardTable],
  data () {
    return {
    }
  },
  mounted () {
    this.updateClipboardItems(
      this.getKeyword(this.$route.query.keyword),
      this.getFilteredDate(this.$route.query.date)
    )
  },
  watch: {
    '$route.query' (v1, v2) {
      let keyword = this.keyword
      if (v1.keyword != v2.keyword) {
        keyword = this.getKeyword(v1.keyword != null ? v1.keyword : null)
      }
      let filteredDate = this.filteredDate
      if (v1.date != undefined && v1.date != v2.date) {
        filteredDate = this.getFilteredDate(v1.date != null ? v1.date : null)
      }
      if (keyword != this.keyword || filteredDate != this.filteredDate) {
        this.updateClipboardItems(keyword, filteredDate)
      }
    },
  },
  methods: {
    getKeyword (keyword) {
      if (keyword != null) {
        return decodeURI(keyword)
      } else {
        return null
      }
    },
    checkClipboardItems () {
      if (this.clipboardItems.length === 0) {
        const path = '/clipboard/notfound'
        if (this.$route.query.date) {
          this.$router.push({
            path: path,
            query: { date: this.$route.query.date }
          })
            .catch(() => {})
        } else {
          this.$router.push(path)
            .catch(() => {})
        }
      }
    },
  },
}
</script>
<style scoped>
</style>
