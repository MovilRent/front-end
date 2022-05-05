<template>
  <div>

    <pv-card class="card">
      <template #content>
        <div class="card">
          <pv-toolbar class="mb-4">
            <template #end>
              <pv-button
                  label="Create entry"
                  icon="pi pi-plus"
                  class="p-button-success mr-2"
                  @click="openNew"
              />
            </template>

          </pv-toolbar>
        </div>

        <pv-data-table
            ref="dt"
            :value="forums"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 15]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tutorials"
            responsiveLayout="scroll"
        >
          <template #header>
            <div
                class="table-header flex flex-column md:flex-row md:justify-content-between"
            >
              <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Entries</h5>
              <span class="p-input-icon-left"
              ><i class="pi pi-search" /><pv-input-text
                  v-model="filters['global'].value"
                  placeholder="Search..."
              />
            </span>
            </div>
          </template>
          <pv-column field="author" header="Author" :sortable="true" style="text-align: center"></pv-column>
          <pv-column
              field="title"
              header="Title"
              :sortable="true"
              style="min-width: 6rem; text-align: center;"
          ></pv-column>
          <pv-column
              field="content"
              header="Description"
              :sortable="true"
              style="max-width:30rem; white-space: nowrap;overflow: hidden; text-overflow: ellipsis;"
          ></pv-column>
          <pv-column
              field="date"
              header="Date"
              :sortable="true"
              style="width: 7.5rem;"
          ></pv-column>
          <pv-column field="rating" header="Rating" :sortable="true" style="width: 10rem">
            <template #body="slotProps">
              <pv-rating v-model="val" :model-value=slotProps.data.rating :cancel="false" :readonly="true"/>
            </template>
          </pv-column>

          <pv-column :exportable="false" style="min-width: 10rem">
            <template #body="slotProps">
              <router-link :to="{ name: 'responses', params: slotProps.data }" style="text-decoration: none">
                <pv-button label="View entry" class="p-button-outlined"></pv-button>
              </router-link>
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>
  </div>
  <pv-dialog
      v-model:visible="forumDialog"
      :style="{ width: '600px' }"
      header="Create entry"
      :modal="true"
      class="p-fluid"
  >
    <div class="field">
        <span class="p-float-label">
          <pv-input-text
              type="text"
              id="title"
              v-model.trim="forum.title"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !forum.title }"
          />
          <label for="title">Title</label>
          <small class="p-error" v-if="submitted && !forum.title"
          >Title is required.</small
          >
        </span>
    </div>
    <div class="field">
        <span class="p-float-label">
          <pv-textarea
              id="content"
              v-model="forum.content"
              required="false"
              rows="2"
              cols="2"
          />
          <label for="content">Description</label>
        </span>
    </div>
    <template #footer>
      <pv-button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="hideDialog"
      />
      <pv-button
          label="Save"
          icon="pi pi-check"
          class="p-button-text"
          @click="saveForum"
      />
    </template>
  </pv-dialog>


</template>

<script>
import { FilterMatchMode } from "primevue/api";
import { ForumApiService } from "../../services/forum-api.service";
import {RatingApiService} from "../../services/rating-api.service";
import { UserApiService } from "../../services/user-api.service";

export default {
  name: "entrances-new.component",
  data() {
    return {
      forums: [],
      forumDialog: false,
      deleteForumsDialog: false,
      deleteForumDialog: false,
      forum: {},
      vals: {},
      selectedForums: null,
      filters: {},
      submitted: false,
      forumsService: null,
      ratingService: null,
      usersService: null,
      fecha: null
    };
  },
  created() {
    this.fecha = new Date();
    this.forumsService = new ForumApiService();
    this.ratingService = new RatingApiService();
    this.usersService = new UserApiService();
    this.forumsService.getAll().then((response) => {
      this.forums = response.data;
      this.forums.forEach( (forum) => {
        this.usersService.getById(forum.userId).then( (response) => {
          forum.author = response.data.name + " " + response.data.lastname;
        });
        this.ratingService.getByForumId(forum.id).then((response) => {
          let promval = 0;
          this.vals = response.data;
          if(this.vals.length == 0) {
            forum.rating = 0
          } else {
            this.vals.forEach((val) => {
              promval += val.rating.valueOf()
            })
            promval /= this.vals.length;
            forum.rating = promval.toFixed(2);
          }
        })
      })
      console.log(this.forums);
    });
    this.initFilters();
  },
  methods: {
    getStorableForum(displayableForum) {
      return {
        id: displayableForum.id,
        title: displayableForum.title,
        content: displayableForum.content,
        date: (displayableForum.date = this.fecha.getDate() + "-" + (this.fecha.getMonth() + 1) + "-" + this.fecha.getFullYear()),
        userId: (displayableForum.userId = 1),
        author: "Manuel Quispe Salazar",
      };
    },
    initFilters() {
      this.filters = {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
      };
    },
    findIndexById(id) {
      return this.forums.findIndex((forum) => forum.id === id);
    },
    openNew() {
      this.forum = {};
      this.submitted = false;
      this.forumDialog = true;
    },
    hideDialog() {
      this.forumDialog = false;
      this.submitted = false;
    },
    getDisplayableForum(forum) {
      return forum;
    },
    saveForum() {
      this.submitted = true;
      if (this.forum.title.trim()) {
        if (this.forum.id) {
          this.forum = this.getStorableForum(this.forum);
          this.forumsService
              .update(this.forum.id, this.forum)
              .then((response) => {
                this.forums[this.findIndexById(response.data.id)] =
                    this.getDisplayableForum(response.data);
                this.$toast.add({
                  severity: "success",
                  summary: "Successful",
                  detail: "Entry Updated",
                  life: 3000,
                });
                console.log(response);
              });
        } else {
          this.forum.id = 0;
          this.forum = this.getStorableForum(this.forum);
          this.forumsService.create(this.forum).then((response) => {
            this.forum = this.getDisplayableForum(response.data);
            this.forums.push(this.forum);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Entry Created",
              life: 3000,
            });
            console.log(response);
          });
        }
      }
      this.forumDialog = false;
      this.forum = {};
    },
  }
};
</script>

<style scoped>
.card{
  margin-top: 1.5rem;

}

</style>
