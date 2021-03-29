<template>
  <div class="bg-white flex pr-2">
    <button
      v-if="pageNum !== 1"
      class="focus:outline-none pr-2"
      @click="goPrevious"
    >
      <i>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </i>
    </button>
    <span class="text-base text-gray-600 font-medium">{{ getClipboardItemCount }}</span>
    <button
      v-if="pageNum < getMaxPage"
      class="focus:outline-none pl-2"
      @click="goNext"
    >
      <i>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ClipboardItemCount',
  data () {
    return {
    }
  },
  props: {
    clipboardItemTotal: {
      type: Number,
      default: 0,
    },
    pageLimitCount: {
      type: Number,
      default: 0,
    },
    pageNum: {
      type: Number,
      default: 1,
    },
  },
  mounted () {
  },
  computed: {
    getMaxPage () {
      if (this.pageLimitCount != 0 && this.clipboardItemTotal > this.pageLimitCount) {
        return parseInt(this.clipboardItemTotal / this.pageLimitCount)
      } else {
        return 1
      }
    },
    getClipboardItemCount () {
      if (this.pageNum < this.getMaxPage) {
        return `${this.pageLimitCount * this.pageNum} / ${this.clipboardItemTotal} items`
      } else {
        return `${this.clipboardItemTotal} item${this.clipboardItemTotal > 1 ? 's' : ''}`
      }
    },
  },
  methods: {
    goPrevious () {
      this.$$emit('prev-page', this.pageNum - 1)
    },
    goNext () {
      this.$$emit('next-page', this.pageNum + 1)
    },
  },
}
</script>
<style scoped>
</style>
