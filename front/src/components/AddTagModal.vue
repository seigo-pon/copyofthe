<template>
  <div
    v-if="show"
    class="fixed overflow-hidden flex justify-center items-center inset-0 z-50 w-full h-100 modal"
  >
		<div class="bg-white rounded border border-gray-200 shadow-lg overflow-y-auto w-11/12 md:max-w-md mx-auto z-50">
			<div class="text-left py-4 px-6">
				<div class="items-center pb-2">
					<span class="text-2xl font-bold">Add tag</span>
				</div>
				<div class="my-2">
          <div class="flex">
            <input
              id="add-tag-input"
              v-model="tagValue"
              class="outline-none focus:outline-none w-full px-2"
              type="text"
              name="tag"
              placeholder="Input adding tag"
              :maxlength="tagMaxLength"
              autofocus
              autocomplete="off"
              spellcheck="false"
            />
            <button
              id="tag-dropdown-button"
              v-if="lastTags.length > 0"
              class="hover:text-gray-400 items-center focus:outline-none focus:shadow-outline rounded-full"
              @click="showLastTag = !showLastTag"
            >
              <template v-if="showLastTag">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </template>
              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </template>
            </button>
          </div>
          <div
            id="last-tag-dropdown"
            v-if="showLastTag"
            class="absolute overflow-y-auto shadow z-40 w-full mt-2 last-tag"
          >
            <ul class="list-none">
              <template v-for="(lastTag, index) in lastTags">
                <li
                  :key="index"
                  class="bg-white hover:bg-gray-200 py-2 px-2 cursor-pointer"
                  @click="clickLastTag(lastTag)"
                >
                  <span>{{ lastTag.value }}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
				<div class="flex justify-end pt-2">
					<button
						class="bg-gray-200 hover:bg-gray-300 rounded-lg focus:outline-none px-4 p-2 mr-4"
            @click="clickCancel"
          >
            Cancel
          </button>
					<button
            :disabled="tagValue.length === 0"
						class="bg-gray-300 hover:bg-gray-400 rounded-lg focus:outline-none px-4 p-2"
            @click="clickOk"
          >
            OK
          </button>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name: 'AddTagModal',
  data () {
    return {
      tagValue: '',
      showLastTag: false,
    }
  },
  model: {
    prop: 'show',
    event: 'update-show',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    lastTags: {
      type: Array,
      default: () => [],
    },
    tagMaxLength: {
      type: Number,
      default: 0,
    },
  },
  mounted () {
    window.addEventListener('click', this.closeDropdown)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.closeDropdown)
  },
  watch: {
    show (v1, v2) {
      if (v1 && !v2) {
        this.tagValue = ''

        setTimeout(() => {
          document.getElementsByName('tag')[0].focus()
        }, 100)
      }
    },
    tagValue () {
      if (this.showLastTag) {
        this.showLastTag = false
      }
    },
  },
  methods: {
    closeDropdown (e) {
      if (!this.showLastTag) {
        return
      }

      let closeLastTagDropDwon = true
      
      const addTagInput = this.$el.querySelector('#add-tag-input')
      if (addTagInput != null && addTagInput.contains(e.target)) {
        closeLastTagDropDwon = false
      }
      const tagDropdownButton = this.$el.querySelector('#tag-dropdown-button')
      if (tagDropdownButton != null && tagDropdownButton.contains(e.target)) {
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
    clickLastTag (lastTag) {
      this.tagValue = lastTag.value
    },
    clickCancel () {
      this.$emit('update-show', false)
    },
    clickOk () {
      this.$emit('click-ok', this.tagValue)
    },
  },
}
</script>
<style scoped>
.modal {
  background: rgba(0,0,0,.4);
}
.last-tag {
  width: 398px;
  max-height: 300px;
}
</style>
