<template>
  <div
    v-if="show"
    class="fixed overflow-hidden flex justify-center items-center inset-0 z-50 w-full h-100 modal"
  >
		<div class="bg-white rounded border border-gray-200 shadow-lg overflow-y-auto w-11/12 md:max-w-md mx-auto z-50">
			<div class="text-left py-4 px-6">
				<div class="items-center pb-2">
					<span class="text-2xl font-bold">{{ title }}</span>
				</div>
				<div class="my-2">
					<span>{{ message }}</span>
				</div>
				<div class="flex justify-end pt-2">
					<button
            v-if="leftButton != null"
						class="bg-gray-200 hover:bg-gray-300 rounded-lg focus:outline-none px-4 p-2 mr-4"
            @click="clickLeft"
          >
            {{ leftButton }}
          </button>
					<button
						class="bg-gray-300 hover:bg-gray-400 rounded-lg focus:outline-none px-4 p-2"
            @click="clickRight"
          >
            {{ rightButton }}
          </button>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  data () {
    return {
    }
  },
  model: {
    prop: 'show',
    event: 'update-show'
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    leftButton: {
      type: String,
      default: null,
    },
    isLeftButtonCancel: {
      type: Boolean,
      default: false,
    },
    rightButton: {
      type: String,
      default: 'OK',
    },
  },
  mounted () {
  },
  methods: {
    clickLeft () {
      if (this.isLeftButtonCancel) {
        this.$emit('update-show', false)
      } else {
        this.$emit('click-left')
      }
    },
    clickRight () {
      this.$emit('click-right')
    },
  },
}
</script>
<style scoped>
.modal {
  background: rgba(0,0,0,.4);
}
</style>
