<template>
  <div>
    <div class="flex items-center">
      <div class="flex items-center mr-3">
        <div class="mr-2">
          <span class="text-xs">Tag</span>
        </div>
        <button
          id="tag-button"
          class="bg-white border border-gray-400 hover:bg-gray-100 items-center focus:outline-none focus:shadow-outline rounded-full mr-1 py-1 px-4 text-xs"
          :class="{'text-gray-700': !isSpcifiedTag, 'text-gray-900': isSpcifiedTag}"
          @click="showLastTag = !showLastTag"
        >
          {{ getTagValue }}
        </button>
      </div>
      <div class="flex items-center">
        <div class="mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            id="favorite"
            v-model="isFavorite"
            class="absolute block bg-white border-4 focus:outline-none focus:shadow-outline rounded-full w-6 h-6 appearance-none cursor-pointer toggle-checkbox"
            type="checkbox"
            name="toggle"
            spellcheck="false"
          />
          <label
            for="favorite"
            class="block bg-gray-300 overflow-hidden rounded-full h-6 cursor-pointer toggle-label"
          />
        </div>
      </div>
    </div>
    <div
      id="last-tag-dropdown"
      v-if="showLastTag"
      class="absolute right-0 overflow-y-auto shadow z-40 w-full mt-2 last-tag"
    >
      <ul class="list-none">
        <template v-for="(lastTag, index) in lastTags">
          <li
            :key="index"
            class="bg-white hover:bg-gray-200 py-2 px-2 text-xs cursor-pointer"
            @click="clickLastTag(lastTag)"
          >
            <span v-if="isSelectedTag(lastTag)" class="pr-2">&#10004;</span>
            <span v-else class="pr-5"></span>
            <span >{{ lastTag.value }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
const tagNoSelection = "Unspecified"

export default {
  name: 'ClipboardFilterOption',
  data () {
    return {
      tagValue: null,
      lastTags: [],
      showLastTag: false,
      isFavorite: false,
    }
  },
  props: {
    initalTag: {
      type: String,
      default: null
    },
    initalLastTags: {
      type: Array,
      default: () => [],
    },
    initalFavorite: {
      type: Boolean,
      default: false
    },
  },
  async mounted () {
    window.addEventListener('click', this.closeDropdown)

    this.tagValue = this.initalTag
    this.isFavorite = this.initalFavorite
  },
  beforeDestroy () {
    window.removeEventListener('click', this.closeDropdown)
  },
  computed: {
    isSpcifiedTag () {
      return (this.tagValue != null)
    },
    getTagValue () {
      return this.isSpcifiedTag ? this.tagValue : tagNoSelection
    },
  },
  watch: {
    tagValue (v1, v2) {
      if (v1 != v2) {
        this.$emit('update-tag', v1)
      }
    },
    initalLastTags (v1, v2) {
      if (v1 != v2) {
        this.lastTags = JSON.parse(JSON.stringify(v1))
        
        // 指定なしを追加
        this.lastTags.unshift({
          id: null,
          value: tagNoSelection
        })
      }
    },
    isFavorite (v1, v2) {
      if (v1 != v2) {
        this.$emit('update-favorite', v1)
      }
    },
  },
  methods: {
    closeDropdown (e) {
      let closeLastTagDropDwon = true
      
      const tagButton = this.$el.querySelector('#tag-button')
      if (tagButton != null && tagButton.contains(e.target)) {
        closeLastTagDropDwon = false
      }
      const lastTagDropdown = this.$el.querySelector('#last-tag-dropdown')
      if (lastTagDropdown != null && lastTagDropdown.contains(e.target)) {
        closeLastTagDropDwon = false
      }
      
      if (closeLastTagDropDwon) {
        this.showLastTag = false
      }
    },
    isSelectedTag (lastTag) {
      if (this.tagValue != null) {
        return (this.tagValue === lastTag.value)
      } else {
        return (lastTag.id === null)
      }
    },
    clickLastTag (lastTag) {
      if (lastTag.id != null) {
        this.tagValue = lastTag.value
      } else {
        this.tagValue = null
      }

      if (this.showLastTag) {
        this.showLastTag = false
      }
    },
  },
}
</script>
<style scoped>
.last-tag {
  width: 200px;
  max-height: 300px;
}
.toggle-checkbox:checked {
  right: 0;
  border-color: #9ca3af;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #9ca3af;
}
</style>
