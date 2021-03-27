<template>
  <div class="relative bg-white">
    <div class="flex justify-between items-center my-6">
      <div class="flex justify-between items-center w-full">
        <ClipboardFilterDate
          placeholderText="Latest"
          :initalDate="getFilteredDate"
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
            @copy-clipboard="copyClipboard"
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
import ClipboardFilterDate from './ClipboardFilterDate.vue'
import ClipboardItem from './ClipboardItem.vue'
import ClipboardItemCount from './ClipboardItemCount.vue'
import View from '../app/view'

export default {
  name: 'ClipboardHistory',
  components: {
    ClipboardFilterDate,
    ClipboardItem,
    ClipboardItemCount,
  },
  mixins: [View],
  data () {
    return {
    }
  },
  mounted () {
    this.updateClipboardKeyword(null)
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
  },
}
</script>
<style scoped>
</style>
