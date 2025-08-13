<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SongFilterBar',
  setup() {
    const filter = ref('')
    const items = ref<string[]>([]) // Replace with your actual songs array

    function reset() {
      filter.value = ''
    }

    return {
      filter,
      items,
      reset
    }
  }
})
</script>

<template>
  <div style="position: fixed; bottom: 0; width: 100%; background-color: white;">
    <div>
      <input
        v-model="filter"
        :placeholder="`Search ${items.length} songs`"
        style="display: inline-block; width: 75%;"
      />
      <button
        @click="reset"
        class="ml-4"
        style="display: inline-block;"
      >
        Clear
      </button>
    </div>
  </div>
</template>
