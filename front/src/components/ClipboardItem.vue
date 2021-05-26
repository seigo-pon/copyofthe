<template>
  <div class="mb-4">
    <notification
      v-model="showNotificationCopySuccess"
      type="success"
      message="Successfully copied!"
    />
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
      :last-tags="lastTags"
      :tag-max-length="tagMaxLength"
      @click-ok="clickAddTagOk"
    />
    <modal
      v-model="showModalRemoveClipboardItem"
      title="Remove this clipboard?"
      message="This clipboard is removed."
      leftButton="Cancel"
      :is-left-button-cancel="true"
      rightButton="OK"
      @click-right="clickRemoveClipboardItemOk"
    />
    <li
      class="bg-white border border-gray-100 shadow-sm hover:bg-gray-200 flex justify-between items-center py-3 px-4 cursor-pointer"
      @click="copyClipboardItem()"
    >
      <div class="flex-grow">
        <div class="flex flex-col">
          <div class="table table-fixed w-full">
            <span class="font-medium table-cell truncate">{{ clipboardItem.value }}</span>
          </div>
          <span class="text-xs text-gray-500">{{ getDate(clipboardItem.updatedAt) }}</span>
          <div class="flex pt-2">
            <template v-for="tag in clipboardItem.tags">
              <button
                class="bg-gray-400 hover:bg-gray-600 focus:outline-none focus:shadow-outline rounded-full mr-1 py-1 px-3 text-white text-xs font-bold"
                @click="removeClipboardItemTag(tag, $event)"
                :key="tag.id"
              >
                {{ tag.value }}
              </button>
            </template>
            <button
              class="hover:text-gray-400 focus:outline-none focus:shadow-outline rounded-full"
              @click="addClipboardItemTag($event)"
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
        <span class="items-center justify-center text-gray-600 text-sm ml-2">
          {{ clipboardItem.copiedCount }} copied
        </span>
      </div>
      <div class="flex-none">
        <button
          class="hover:text-gray-400 justify-center focus:outline-none focus:shadow-outline text-gray-500 ml-2"
          :class="isFavoriteClipboardItem(clipboardItem)"
          @click="favorClipboardItem($event)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>
      <div class="flex-none">
        <button
          class="hover:text-gray-400 items-center justify-center focus:outline-none focus:shadow-outline text-gray-500 ml-4"
          @click="removeClipboardItem($event)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="w-6 h-6"
            >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </li>
  </div>
</template>

<script>
import Notification from './Notification.vue'
import Modal from './Modal.vue'
import AddTagModal from './AddTagModal.vue'

export default {
  name: 'ClipboardItem',
  components: {
    Notification,
    Modal,
    AddTagModal,
  },
  data () {
    return {
      showNotificationCopySuccess: false,
      removingTagId: null,
      showModalRemoveTag: false,
      showModalAddTag: false,
      showModalRemoveClipboardItem: false,
    }
  },
  props: {
    clipboardItem: {
      type: Object,
      default: () => {},
    },
    lastTags: {
      type: Array,
      default: () => {},
    },
    tagMaxLength: {
      type: Number,
      default: 0,
    },
  },
  mounted () {
  },
  methods: {
    getDate (date) {
      return this.$moment(date).format('YYYY/MM/DD (ddd) HH:mm:ss')
    },
    copyClipboardItem () {
      this.showNotificationCopySuccess = true
      this.$emit('copy-clipboard', this.clipboardItem)
    },
    removeClipboardItemTag (tag, e) {
      e.stopPropagation()
      this.removingTagId = tag.id
      this.showModalRemoveTag = true
    },
    async addClipboardItemTag (e) {
      e.stopPropagation()
      this.showModalAddTag = true
    },
    isFavoriteClipboardItem (clipboardItem) {
      return clipboardItem.isFavorite ? 'text-yellow-500' : 'text-gray-500'
    },
    favorClipboardItem(e) {
      e.stopPropagation()
      this.$emit('update-favorite-clipboard', this.clipboardItem)
    },
    removeClipboardItem (e) {
      e.stopPropagation()
      this.showModalRemoveClipboardItem = true
    },
    clickRemoveTagOk () {
      this.$emit('remove-clipboard-tag', this.clipboardItem, this.removingTagId)
      this.showModalRemoveTag = false
    },
    clickAddTagOk (tagValue) {
      this.$emit('add-clipboard-tag', this.clipboardItem, tagValue)
      this.showModalAddTag = false
    },
    clickRemoveClipboardItemOk () {
      this.$emit('remove-clipboard', this.clipboardItem)
      this.showModalRemoveClipboardItem = false
    },
  },
}
</script>
<style scoped>
</style>
