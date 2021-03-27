<template>
  <slide-x-right-transition>
    <div v-show="show" class="fixed top-8 right-4">
      <div class="bg-white rounded border border-gray-200 shadow-md p-2">
        <div class="flex flex-row">
          <div class="px-2">
            <i>
              <template v-if="type === 'info'">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </template>
              <template v-else-if="type === 'success'">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </template>
              <template v-else-if="type === 'error'">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </template>
            </i>
          </div>
          <div class="ml-2 mr-6">
            <span class="font-semibold">{{ message }}</span>
          </div>
        </div>
      </div>
    </div>
  </slide-x-right-transition>
</template>

<script>
import { SlideXRightTransition } from 'vue2-transitions'

export default {
  name: 'Notification',
  components: {
    SlideXRightTransition,
  },
  data () {
    return {
      showId: null,
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
    type: {
      type: String,
      default: 'info',
    },
    message: {
      type: String,
      default: '',
    },
  },
  mounted () {
  },
  watch: {
    show (v1, v2) {
      if (v1 && !v2) {
        if (this.showId != null) {
          clearInterval(this.showId)
        }
        this.showId = setInterval(() => {
          this.$emit('update-show', false)
        }, 2000)
      }
    },
  },
  methods: {
  },
}
</script>
<style scoped>
</style>
