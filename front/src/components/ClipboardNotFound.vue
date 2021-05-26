<template>
  <div class="relative bg-white">
    <div class="flex pt-1">
      <div class="flex justify-end items-center w-full">
        <clipboard-filter-option />
      </div>
    </div>
    <div class="flex justify-between items-center my-6">
      <div class="flex justify-between items-center w-full">
        <span class="px-4 text-gray-700 text-xl">Not results</span>
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardFilterOption from './ClipboardFilterOption.vue'

export default {
  name: 'ClipboardNotFound',
  components: {
    ClipboardFilterOption,
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  },
}
</script>
<style scoped>
</style>
