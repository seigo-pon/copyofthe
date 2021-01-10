<template>
  <div class="mb-4">
    <modal
      v-model="showModalRemoveTag"
      title="Remove this tag?"
      message="This tag is removed."
      leftButton="Cancel"
      :is-left-button-cancel="true"
      rightButton="OK"
      @click-right="clickRemoveTagOk"
    />
    <add-tag-modal
      v-model="showModalAddTag"
      @click-ok="clickAddTagOk"
    />
    <notification
      v-model="showNotificationCopySuccess"
      type="success"
      message="Successfully copied!"
    />
    <li
      class="bg-white border border-gray-100 shadow-sm hover:bg-gray-200 flex justify-between items-center py-3 px-4 cursor-pointer"
      @click="copyClipboardItem(clipboardItem)"
    >
      <div class="flex-grow">
        <div class="flex flex-col">
          <span class="text-lg font-bold truncate">{{ clipboardItem.value }}</span>
          <span class="text-xs text-gray-500">{{ getDate(clipboardItem.updatedAt) }}</span>
          <div class="flex pt-2">
            <template v-for="tag in clipboardItem.tags">
              <button
                class="bg-gray-400 hover:bg-gray-600 flex items-center focus:outline-none focus:shadow-outline rounded-full mr-1 py-1 px-3 text-white text-xs font-bold"
                @click="removeTag(clipboardItem, tag, $event)"
                :key="tag.id"
              >
                {{ tag.value }}
              </button>
            </template>
            <button
              class="hover:text-gray-400 flex items-center focus:outline-none focus:shadow-outline rounded-full"
              @click="addTag(clipboardItem, $event)"
            >
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
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="flex-none">
        <span class="flex items-center justify-center text-gray-600 text-sm">
          {{ clipboardItem.copiedCount }} copied
        </span>
      </div>
    </li>
  </div>
</template>

<script>
import Modal from './Modal.vue'
import Notification from './Notification.vue'
import AddTagModal from './AddTagModal.vue'

export default {
  name: 'ClipboardItem',
  components: {
    Modal,
    Notification,
    AddTagModal,
  },
  data () {
    return {
      removingTagId: null,
      showModalRemoveTag: false,
      showNotificationCopySuccess: false,
      showModalAddTag: false,
    }
  },
  props: {
    clipboardItem: {
      type: Object,
      default: () => {},
    }
  },
  mounted () {
  },
  methods: {
    getDate (date) {
      return this.$moment(date).format('YYYY/MM/DD HH:mm:ss')
    },
    copyClipboardItem (clipboardItem) {
      console.log(clipboardItem)
      this.showNotificationCopySuccess = true
    },
    removeTag (clipboardItem, tag, e) {
      e.stopPropagation()
      this.removingTagId = tag.id
      this.showModalRemoveTag = true
    },
    addTag (clipboardItem, e) {
      e.stopPropagation()
      this.showModalAddTag = true
    },
    clickRemoveTagOk () {
      this.$emit('remove-tag', this.clipboardItem.id, this.removingTagId)
      this.showModalRemoveTag = false
    },
    clickAddTagOk (tagValue) {
      this.$emit('add-tag', this.clipboardItem.id, tagValue)
      this.showModalAddTag = false
    },
  },
}
</script>
<style scoped>
</style>
