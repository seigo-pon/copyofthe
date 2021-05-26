<template>
  <div class="relative bg-white">
    <div class="flex pt-1">
      <div class="flex justify-end items-center w-full">
        <clipboard-filter-option />
      </div>
    </div>
    <div class="flex justify-between items-center my-3">
      <div class="flex justify-between items-center w-full">
        <div class="flex">
          <span class="px-4 text-gray-700 text-xl">Searched result</span>
          <clipboard-filter-date
            placeholderText="All Days"
            :inital-date="getFilteringDate($route.query.date)"
            @update-date="updateFilteringDate"
          />
        </div>
        <clipboard-item-count
          :clipboard-item-total="clipboardItemTotal"
          :page-limit-count="pageLimitCount"
          :page-num="pageNum"
          @prev-page="updatePage"
          @next-page="updatePage"
        />
      </div>
    </div>
    <div class="my-4">
      <ul class="list-none">
        <template v-for="clipboardItem in clipboardItems">
          <clipboard-item
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
import ClipboardPage from './clipboardpage'
import View from '../app/view'
import ClipboardFilterOption from './ClipboardFilterOption.vue'
import ClipboardFilterDate from './ClipboardFilterDate.vue'
import ClipboardItemCount from './ClipboardItemCount.vue'
import ClipboardItem from './ClipboardItem.vue'

export default {
  name: 'ClipboardResult',
  components: {
    ClipboardFilterOption,
    ClipboardFilterDate,
    ClipboardItemCount,
    ClipboardItem,
  },
  mixins: [View, ClipboardPage],
  data () {
    return {
    }
  },
  async mounted () {
    await this.updateClipboardItems(
      this.getKeyword(this.$route.query.keyword),
      this.getFilteringTag(this.$route.query.tag),
      this.getFilteringFavorite(this.$route.query.favorite),
      this.getFilteringDate(this.$route.query.date)
    )
    this.checkClipboardItems()
  },
  watch: {
    async '$route.query' (v1, v2) {
      let keyword = this.keyword
      if (v1.keyword != v2.keyword) {
        keyword = this.getKeyword(v1.keyword || null)
      }
      let filteringTag = this.filteringTag
      if (v1.tag != v2.tag) {
        filteringTag = this.getFilteringTag(v1.tag || null)
      }
      let filteringFavorite = this.filteringFavorite
      if (v1.favorite != v2.favorite) {
        filteringFavorite = this.getFilteringFavorite(v1.favorite || null)
      }
      let filteringDate = this.filteringDate
      if (v1.date != v2.date) {
        filteringDate = (v1.date != null && v1.date != 0) ? v1.date : null
      }
      if (keyword != this.keyword ||
        filteringTag != this.filteringTag ||
        filteringFavorite != this.filteringFavorite ||
        filteringDate != this.filteringDate) {
        await this.updateClipboardItems(
          keyword,
          filteringTag,
          filteringFavorite,
          this.getFilteringDate(filteringDate)
        )
        this.checkClipboardItems()
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

        const query = this.getQuery()
        if (Object.keys(query).length != 0) {
          this.$router.push({ path: path, query: query })
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
