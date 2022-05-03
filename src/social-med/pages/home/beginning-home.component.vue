<template>
  <pv-card class="card">
    <template #title>
      Recomended entries for you
    </template>
    <template #content>
  <pv-data-table :value="forums" :rows=4 responsiveLayout="stack">
    <pv-column field="author" header="Author" headerClass="column" style="text-align: center;"></pv-column>
    <pv-column field="title" header="Title" style="text-align: center"></pv-column>
    <pv-column field="content" header="Description" style="text-align: justify;+"></pv-column>
    <pv-column field="date" header="Publication date" style="text-align: center"></pv-column>
    <pv-column field="rating" header="Rating" style="width: 12rem">
      <template #body="slotProps">
        <pv-rating v-model="val" :model-value="slotProps.data.rating" :cancel="false" :readonly="true"/>
      </template>
    </pv-column>
    <pv-column>
      <template #body="slotProps">
        <pv-button label="Ir" class="p-button-outlined" @click="goEntry(slotProps.data)"></pv-button>
      </template>

    </pv-column>

  </pv-data-table>
    </template>
  </pv-card>

  <pv-card class="card">
    <template #title>
      Recomended doctors for you
    </template>
    <template #content>
      <pv-carousel :value="users" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" class="custom-carousel" :circular="true" :autoplayInterval="5000">
        <template #item="slotProps">
          <div class="doctor-profile">
              <img :src="'../media/' + slotProps.data.image" class="doctor-image"/>
              <h3 class="doctor-name">{{ slotProps.data.fullname }}</h3>
              <h4>{{ slotProps.data.specialist}}</h4>
              <h5 class="doctor-description">{{ slotProps.data.recommendation}} Recommendations</h5>
              <h5 class="doctor-description">{{ slotProps.data.workplace}}</h5>
              <pv-button label="View profile" class="p-button-outlined" @click="goEntry(slotprops.data)"></pv-button>
          </div>
        </template>
      </pv-carousel>
    </template>
  </pv-card>

</template>

<script>
import { ForumApiService } from "../../services/forum.service";
import { UserApiService } from "../../services/user.service";

export default {
  name: "beginning-home.component",
  data(){
    return{
      forums: {},
      users: {},
      forum: {},
      forumsService: null,
      usersService: null,
      user: null
    }
  },
  created() {
    this.forumsService = new ForumApiService();
    this.usersService = new UserApiService();
    this.forumsService.getAll().then((response) => {
      this.forums = response.data;
      this.forums.forEach( (forum) => {
        this.usersService.getById(forum.userId).then( (response) => {
          forum.author = response.data.name + " " + response.data.lastname;
        });
      })
    })
    this.usersService.getAll().then((response) => {
      this.users = response.data;
      this.users.forEach( (user) => {
        user.fullname = user.name + " " + user.lastname;
      })
    });
  },

};
</script>

<style>
 .card{
   margin-top: 1.5rem;
 }

 .doctor-profile {
   border: 1px solid var(--surface-border);
   border-color: blue;
   border-radius: 3px;
   margin: .3rem;
   text-align: center;
   padding: 2rem 0;
 }

 .doctor-image{
   width:7rem;
   height: 7rem;
   border-radius: 50%;
   border: solid 1px #000000
 }

 .doctor-name{
   font-family: Roboto, sans-serif;
   font-size: 1.25rem;
 }

 .doctor-description{
   font-weight: lighter;
   margin: 2px;
 }

 .p-button-outlined{
   margin-top: 1.5rem;
 }
</style>

