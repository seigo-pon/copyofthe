<template>
  <div class="relative bg-white min-h-screen">
    <clipboard-header v-model="keyword" />
    <div class="my-4 mx-6">
      <router-view />
    </div>
    <app-footer class="bottom-0 w-full" />
  </div>
</template>

<script>
import AppFooter from './AppFooter.vue'
import ClipboardHeader from './ClipboardHeader.vue'

export default {
  name: 'Clipboard',
  components: {
    ClipboardHeader,
    AppFooter,
  },
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
          if (this.$route.query.date) {
            this.$router.push({
              path: path,
              query: {
                date: this.$route.query.date
              }
            })
              .catch(() => {})
          } else {
            this.$router.push({ path: path })
              .catch(() => {})
          }
        } else {
          const path = '/clipboard'
          if (this.$route.query.date) {
            this.$router.push({
              path: path,
              query: {
                keyword: encodeURI(v1),
                date: this.$route.query.date
              }
            })
              .catch(() => {})
          } else {
            this.$router.push({
              path: path,
              query: { keyword: encodeURI(v1) }
            })
              .catch(() => {})
          }
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
