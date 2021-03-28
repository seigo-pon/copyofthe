export default {
  data () {
    return {
    }
  },
  methods: {
    getFilteredDate (date) {
      if (date) {
        return new Date(Number(date))
      } else {
        return null
      }
    },
    updateFilteredDate (date) {
      console.log('updateFilteredDate', date)
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