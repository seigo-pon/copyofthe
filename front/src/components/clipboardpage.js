export default {
  data () {
    return {
    }
  },
  methods: {
    getQuery() {
      let query = {}
      if (this.$route.query.keyword != null) {
        query = Object.assign(query, { keyword: this.$route.query.keyword })
      }
      if (this.$route.query.favorite != null) {
        query = Object.assign(query, { favorite: this.$route.query.favorite })
      }
      if (this.$route.query.tag != null) {
        query = Object.assign(query, { tag: this.$route.query.tag })
      }
      if (this.$route.query.date != null) {
        query = Object.assign(query, { date: this.$route.query.date })
      }
      return query
    },
    getFilteringTag (tag) {
      if (tag != null) {
        return decodeURI(tag)
      } else {
        return null
      }
    },
    getFilteringFavorite (isFavorite) {
      if (isFavorite != null) {
        return (isFavorite != 0)
      } else {
        return null
      }
    },
    getFilteringDate (date) {
      if (date != null) {
        return new Date(Number(date))
      } else {
        return null
      }
    },
    updateFilteringTag (tag) {
      console.log('updateFilteringTag', tag)

      let query = this.getQuery()
      if (tag != null) {
        query = Object.assign(query, { tag: encodeURI(tag) })
      } else {
        if (query.tag != null) {
          delete query.tag
        }
      }
      
      if (Object.keys(query).length != 0) {
        this.$router.push({ path: this.$route.path, query: query })
          .catch(() => {})
      } else {
        this.$router.push({ path: this.$route.path })
          .catch(() => {})
      }
    },
    updateFilteringFavorite (isFavorite) {
      console.log('updateFilteringFavorite', isFavorite)

      let query = this.getQuery()
      if (isFavorite) {
        query = Object.assign(query, { favorite: 1 })
      } else {
        if (query.favorite != null) {
          delete query.favorite
        }
      }
      
      if (Object.keys(query).length != 0) {
        this.$router.push({ path: this.$route.path, query: query })
          .catch(() => {})
      } else {
        this.$router.push({ path: this.$route.path })
          .catch(() => {})
      }
    },
    updateFilteringDate (date) {
      console.log('updateFilteringDate', date)

      let query = this.getQuery()
      if (date != null) {
        query = Object.assign(query, { date: date.getTime() })
      } else {
        if (query.date != null) {
          delete query.date
        }
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