<template>
  <div class="bg-white">
    <div class="mx-6 my-4 text-center">
      <div class="inline-block bg-white border border-gray-100 shadow-sm justify-center items-center py-3 px-4">
        <div class="mx-4 my-4">
          <img class="block rounded-full m-auto w-40" :src="getGithubProfileIcon" alt="avatar">
        </div>
        <div class="text-center">
          <span class="text-lg font-bold uppercase">
            {{ projectName }}
          </span>
        </div>
        <div class="text-center mb-2">
          <span class="text-sm">
            Version {{ projectVersion }}
          </span>
        </div>
        <div class="flex justify-center items-center">
          <div class="flex-none pl-2 text-sm">
            <span class="flex-auto pr-2">&copy; {{ getCopyrightYear }}</span>
            <span class="flex-auto pr-2">{{ username }}</span>
            <span class="flex-auto pr-2">All Rights Reserved.</span>
          </div>
          <div class="flex-none pr-2">
            <a :href="getGithubPageLink" target="_blank">
              <img class="w-4 h-4" :src="githubImage" alt="github">
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { name, version } from '../../../package.json'
import GithubImage from '@/assets/github.png'

export default {
  name: 'About',
  data () {
    return {
      username: process.env.VUE_APP_USERNAME,
      firstYear: process.env.VUE_APP_RELEASE_YEAR,
      projectName: name,
      projectVersion: version,
      githubImage: GithubImage,
    }
  },
  mounted () {
  },
  computed: {
    getGithubProfileIcon () {
      return `https://github.com/${this.username}.png`
    },
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
