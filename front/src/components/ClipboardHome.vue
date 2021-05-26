<template>
  <div class="relative bg-white min-h-screen">
    <clipboard-header
      v-model="keyword"
      class="fixed top-0 left-0 w-full z-10"
    />
    <div class="mt-24 mb-8 mx-6">
      <router-view />
    </div>
    <!-- <app-footer class="bottom-0 w-full" /> -->
  </div>
</template>

<script>
import ClipboardPage from './clipboardpage'
import ClipboardHeader from './ClipboardHeader.vue'
// import AppFooter from './AppFooter.vue'

export default {
  name: 'Clipboard',
  components: {
    ClipboardHeader,
    // AppFooter,
  },
  mixins: [ClipboardPage],
  data () {
    return {
      keyword: '',
    }
  },
  mounted () {
    this.keyword = this.$route.query.keyword || ''
  },
  watch: {
    keyword (v1, v2) {
      if (v1 != v2) {
        if (v1 === '') {
          const path = '/'

          let query = this.getQuery()
          if (query.keyword) {
            delete query.keyword
          }

          if (Object.keys(query).length != 0) {
            this.$router.push({ path: path, query: query })
              .catch(() => {})
          } else {
            this.$router.push({ path: path })
              .catch(() => {})
          }
        } else {
          const path = '/clipboard'

          let query = this.getQuery()
          query = Object.assign(query, { keyword: encodeURI(v1) })

          this.$router.push({ path: path, query: query })
            .catch(() => {})
        }
      }
    },
  },
  methods: {
  },
}
</script>
<style scoped>
</style>
