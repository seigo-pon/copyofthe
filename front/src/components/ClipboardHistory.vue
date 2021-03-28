<template>
  <div class="relative bg-white">
    <div class="flex justify-between items-center my-6">
      <div class="flex justify-between items-center w-full">
        <ClipboardFilterDate
          placeholderText="Latest"
          :initalDate="getFilteredDate($route.query.date)"
          @update-date="updateFilteredDate"
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
  name: 'ClipboardHistory',
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
    this.updateClipboardItems(null, this.getFilteredDate(this.$route.query.date))
  },
  watch: {
    '$route.query' (v1, v2) {
      if (v1.date != v2.date) {
        this.updateClipboardItems(null, this.getFilteredDate(v1.date != null ? v1.date: null))
      }
    },
  },
}
</script>
<style scoped>
</style>
