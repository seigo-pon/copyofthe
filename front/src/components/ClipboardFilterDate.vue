<template>
  <div>
    <datepicker
      v-model="filteringDate"
      input-class="w-36 px-4 text-xl text-gray-600 focus:outline-none"
      :language="ja"
      :open-date="filteringDate"
      :clear-button="true"
      format="yyyy/MM/dd"
      :placeholder="placeholderText"
    />
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import { ja } from 'vuejs-datepicker/dist/locale'

export default {
  name: 'ClipboardFilterDate',
  components: {
    Datepicker,
  },
  data () {
    return {
      ja: ja,
      filteringDate: null,
    }
  },
  props: {
    placeholderText: {
      type: String,
      default: ''
    },
    initalDate: {
      type: Date,
      default: null
    },
  },
  mounted () {
    this.filteringDate = this.initalDate
  },
  watch: {
    filteringDate (v1, v2) {
      if (v1 != v2) {
        this.$emit('update-date', v1)
      }
    },
  },
  methods: {
  },
}
</script>
<style scoped>
</style>
