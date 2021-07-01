<template>
  <footer class="bg-white text-right">
    <div class="mx-4 border-b-2"></div>
    <div class="flex justify-between items-center w-full py-2 px-4">
      <div class="flex-grow py-2 pl-2 text-sm">
        <span class="flex-auto pr-2">&copy; {{ getCopyrightYear }}</span>
        <a class="flex-auto pr-2" :href="getTwitterPageLink" target="_blank">{{ username }}</a>
        <span class="flex-auto pr-2">All Rights Reserved.</span>
      </div>
      <div class="flex-none pr-2">
        <a :href="getGithubPageLink" target="_blank">
          <img class="w-4 h-4" :src="githubImage" alt="github">
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
import GithubImage from '@/assets/github.png'

export default {
  name: 'AppFooter',
  data () {
    return {
      username: process.env.VUE_APP_USERNAME,
      firstYear: process.env.VUE_APP_RELEASE_YEAR,
      githubImage: GithubImage,
    }
  },
  mounted () {
  },
  computed: {
    getCopyrightYear () {
      const year = (new Date()).getFullYear()
      if (this.firstYear === year.toString()) {
        return year
      } else {
        return `${this.firstYear}-${year}`
      }
    },
    getGithubPageLink () {
      return `https://github.com/${this.username}`
    },
  },
  methods: {
  },
}
</script>
<style scoped>
</style>
