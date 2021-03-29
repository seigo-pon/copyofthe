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

      let query = {}
      if (this.$route.query.keyword) {
        query = Object.assign(query, { keyword: this.$route.query.keyword })
      }
      if (date) {
        query = Object.assign(query, { date: date.getTime() })
      }
      
      if (Object.keys(query).length != 0) {
        this.$router.push({ path: this.$route.path, query: query })
          .catch(() => {})
      } else {
        this.$router.push({ path: this.$route.path })
          .catch(() => {})
      }
    },
  },
}