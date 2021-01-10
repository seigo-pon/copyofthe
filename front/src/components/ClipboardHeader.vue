<template>
  <header class="bg-white">
    <div class="flex justify-between items-center w-full pt-8 pb-4 px-4">
      <span class="flex-none items-center pl-2">
        <i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </i>
      </span>
      <input
        v-model="keywordRaw"
        class="bg-transparent flex-grow text-3xl outline-none focus:outline-none w-full px-4"
        type="text"
        name="keyword"
        placeholder="Search copied value"
        :maxlength="keywordMaxLength"
        autofocus
        autocomplete="off"
      />
      <span class="flex-none pr-2">
        <a href="" target="_blank">
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </i>
        </a>
      </span>
    </div>
    <div class="mx-6 border-b-2"></div>
  </header>
</template>

<script>
export default {
  name: 'ClipboardHeader',
  components: {
  },
  data () {
    return {
      keywordMaxLength: 100,
      keywordRaw: '',
    }
  },
  model: {
    prop: 'keyword',
    event: 'update-keyword',
  },
  props: {
    keyword: {
      type: String,
      default: '',
    }
  },
  mounted () {
    this.keywordRaw = this.keyword
  },
  watch: {
    keywordRaw (v1, v2) {
      if (v1 != v2) {
        this.$emit('update-keyword', this.keywordRaw)
      }
    }
  },
  methods: {
  },
}
</script>
<style scoped>
</style>
