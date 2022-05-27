<template>
  <div class="grid">
    <div class="col-2">
      <pv-card class="card">
        <template #content>
          <img :src="'../media/' + this.$route.params.image" class="doctor-image"/>
          <h3>{{ this.$route.params.name + " " + this.$route.params.lastname }}</h3>
          <h5> {{ this.$route.params.email }}</h5>
          <h5>Phone number: </h5>
          <h6>{{ this.$route.params.phone }}</h6>
          <h5>Speciality:</h5>
          <h6>{{ this.$route.params.specialist }}</h6>
          <h5>Residence country:</h5>
          <h6>{{ this.$route.params.residence }}</h6>
          <h5>Work place:</h5>
          <h6>{{ this.$route.params.workplace }}</h6>
          <h4>{{this.recommendations}} Recommendations</h4>
            <template v-if="recommended">
              <pv-button label="Recommended" icon="pi pi-check" iconPos="right" class="p-button-sm"/>
            </template>
            <template v-else>
              <pv-button label="Recommend" class="p-button-sm"/>
            </template>
            <pv-button label="Send message" class="p-button-sm"/>
        </template>
      </pv-card>
    </div>
    <div class="col-10">
      <div class="grid">
        <div class="col">
          <pv-card class="card">
            <template #title>
              <p>Biography: </p>
            </template>
            <template #content>
              <p class="bio">{{this.$route.params.biography}}</p>
            </template>
          </pv-card>
        </div>
        <div class="col">
          <pv-card class="card">
            <template #content>
              <pv-data-table
                ref="dt"
                :value="forums"
                dataKey="id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 15]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                responsiveLayout="scroll"
              >
                <template #header>
                  <div
                    class="table-header flex flex-column md:flex-row md:justify-content-between"
                  >
                    <h5 class="mb-2 md:m-0 p-as-md-center text-xl">Their entries</h5>
                    <span class="p-input-icon-left"
                    ><i class="pi pi-search" /><pv-input-text
                      v-model="filters['global'].value"
                      placeholder="Search..."
                    />
                    </span>
                  </div>
                </template>
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
                <pv-column field="rating" header="Rating" :sortable="true" style="width: 18rem">
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

      </div>
    </div>
  </div>
</template>

<script>
import { RecommendationApiService } from "../../services/recommendation-api.service";
import { ForumApiService } from "../../services/forum-api.service";
import { RatingApiService } from "../../services/rating-api.service";
import { UserApiService } from "../../services/user-api.service";
import { FilterMatchMode } from "primevue/api";

export default {
  name: "profile-view",
  data(){
    return {
      recommendations: 0,
      recommendacionApiService: null,
      recommended: false,
      forums: [],
      forumsService: null,
      vals: {},
      filters: {},
      ratingService: null,
      usersService: null
    }
  },
  created(){
    this.recommendacionApiService = new RecommendationApiService();
    this.recommendacionApiService.getByRecommendedUserId(this.$route.params.id).then((response) => {
      this.recommendations = response.data.length
    })

    this.forumsService = new ForumApiService();
    this.ratingService = new RatingApiService();
    this.usersService = new UserApiService();
    this.forumsService.getByUserId(this.$route.params.id).then((response) => {
      this.forums = response.data;
      this.forums.forEach( (forum) => {
        this.usersService.getById(forum.userId).then( (response) => {
          forum.author = response.data.name + " " + response.data.lastname;
        });
        this.ratingService.getByForumId(forum.id).then((response) => {
          let promval = 0;
          this.vals = response.data;
          if(this.vals.length === 0) {
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
    initFilters() {
      this.filters = {
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
      };
    },
  }
};
</script>

<style scoped>
.doctor-profile {
  border: 1px solid var(--surface-border);
  border-color: blue;
  border-radius: 3px;
  margin: .3rem;
  text-align: center;
  padding: 2rem 0;
}
.card{
  margin-top: 1rem;
}

h4{
  font-family: Roboto, sans-serif;
  font-weight: normal;
  font-size: 12px;
  margin-top: 0px;
  margin-bottom: 1rem;
}

h5{
  font-family: Roboto, sans-serif;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 0;
}
h6{
  font-family: Roboto, sans-serif;
  font-weight: lighter;
  font-size: 12px;
  margin-top: 0px;
  margin-bottom: 1rem;
}

.p-button-sm{
  margin-top: 1rem;
}

.bio{
  margin: 0;
}
</style>
