<script>
import {client,sendRequest} from './client.ts'
import SongFilterBar from './components/SearchBar.vue'
import _ from 'lodash'

export default {
  name: 'App',

  components: {
    SongFilterBar,
  },

  watch: {
    filter() {
      this.doFilter()
    },
    sortBy() {
      this.doFilter()
    },
    sortDesc() {
      this.doFilter()
    }
  },

  computed: {
    itemsForList() {
      return this.itemsFiltered.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage,
      );
    }
  },
  
  data() {
    return {
      currentPage: 1,
      perPage: 10,
      items: [],
      itemsFiltered: [],
      groups: [],
      sortBy: '',
      sortDesc: false,
      fields: [
        {key: 'group', label: 'Pack', sortable: true},
        {key: 'title', label: 'Title', sortable: true},
        {key: 'artist', label: 'Artist', sortable: true},
        {key: 'charts', label: 'Charts'},
        {key: 'actions', label: 'Actions'}
      ],
      loadingLeft: 0,
      loading: true,
      filter: '',

      doFilter: function() {}
    }
  },
  methods: {
    reset() {
      this.filter = ''
      this.sortBy = ''
      this.sortDesc = false
      this.currentPage = 1
    },
    sendRequest,
    selectSong(song) {
      console.log("Select: ", song);
      this.sendRequest("SelectSong", song)
    },
    async loadSongs() {
      let me = this;
      
      me.groups = (await this.sendRequest('GetGroups', {})).groups
      me.loadingLeft = me.groups.length

      for(let g=0; g<me.groups.length; g++) {
        const group = me.groups[g]
        const songs = (await me.sendRequest("GetSongsInGroup", {group})).songs
        
        songs.forEach(song => {
          song.group = group

          if(!song.steps) {
            return
          }
        
          song.charts = song.steps
            .filter((s) => s.type == "Dance_Single")
            .map((s) => s.meter)
            .sort(function(a, b){return a-b})
            .join(', ')

          me.items.push(song)
        })

        me.loadingLeft -= 1
      }

      me.itemsFiltered = me.items
      me.loading = false
    }
  },
  created() {
    let me = this;

    client.onopen = function() {
      console.log("Open");
      me.loadSongs()
    };

    this.doFilter = _.debounce(function() {
      me.itemsFiltered = me.items.filter((i) => {
        const searchKey = [
          i.artist.toLowerCase(),
          i.title.toLowerCase(),
          i.group.toLowerCase()
        ].join(' ')

        return searchKey.includes(me.filter.toLowerCase())
      })

      me.currentPage = 1
      me.itemsFiltered.sort((a, b) => {

        if(a[me.sortBy] < b[me.sortBy]) {
          return me.sortDesc ? -1 : 1
        }

        if(a[me.sortBy] > b[me.sortBy]) {
          return me.sortDesc ? 1 : -1
        }

        return 0

      })

    }, 1000)
  }
}
</script>

<style>

</style>

<template>
  <div id="app" style="padding-top: 30px; padding-bottom: 60px;">
    <progress v-if="loading" :value="groups.length - loadingLeft" :max="groups.length" class="mb-12" style="margin-bottom: 30px"></progress>

    <div id="SongSearch">

      <SongFilterBar />

    </div>

    <table id="itemList">
      <thead>
        <tr>
          <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in itemsForList" :key="item.title">
          <td>
            <a href="javascript:void(0)" @click="filter = item.group">{{ item.group }}</a>
          </td>
          <td>{{ item.title }}</td>
          <td>{{ item.artist }}</td>
          <td>{{ item.charts }}</td>
          <td>
            <button @click="() => selectSong(item)">Select</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div style="text-align: center; margin-top: 20px;">
      <button :disabled="currentPage === 1" @click="currentPage--">Prev</button>
      <span>Page {{ currentPage }}</span>
      <button :disabled="currentPage * perPage >= itemsFiltered.length" @click="currentPage++">Next</button>
    </div>
  </div>
</template>

