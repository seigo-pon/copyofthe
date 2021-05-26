<template>
  <div class="relative bg-white">
    <div class="flex pt-1">
      <div class="flex justify-end items-center w-full">
        <clipboard-filter-option
          :inital-tag="getFilteringTag($route.query.tag)"
          :inital-last-tags="lastTags"
          :inital-favorite="getFilteringFavorite($route.query.favorite)"
          @update-tag="updateFilteringTag"
          @update-favorite="updateFilteringFavorite"
        />
      </div>
    </div>
    <div class="flex my-3">
      <div class="flex justify-between items-center w-full">
        <clipboard-filter-date
          placeholderText="Latest"
          :inital-date="getFilteringDate($route.query.date)"
          @update-date="updateFilteringDate"
        />
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
          <clipboard-item
            :key="clipboardItem.id"
            :clipboard-item="clipboardItem"
            :last-tags="lastTags"
            :tag-max-length="tagMaxLength"
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
import ClipboardItem from './ClipboardItem.vue'
import ClipboardItemCount from './ClipboardItemCount.vue'

export default {
  name: 'ClipboardHistory',
  components: {
    ClipboardFilterOption,
    ClipboardFilterDate,
    ClipboardItem,
    ClipboardItemCount,
  },
  mixins: [View, ClipboardPage],
  data () {
    return {
    }
  },
  async mounted () {
    await this.getLastTags()
    await this.updateClipboardItems(
      null,
      this.getFilteringTag(this.$route.query.tag),
      this.getFilteringFavorite(this.$route.query.favorite),
      this.getFilteringDate(this.$route.query.date)
    )
  },
  watch: {
    async '$route.query' (v1, v2) {
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
      if (filteringTag != this.filteringTag ||
        filteringFavorite != this.filteringFavorite ||
        filteringDate != this.filteringDate) {
        await this.updateClipboardItems(
          null,
          filteringTag,
          filteringFavorite,
          this.getFilteringDate(filteringDate)
        )
      }
    },
  },
}
</script>
<style scoped>
</style>
