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
      <template #body="slotprops">
        <pv-button label="Ir" class="p-button-outlined" @click="goEntry(slotprops.data)"></pv-button>
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
  <pv-data-table :value="users" responsiveLayout="stack">

    <pv-column field="fullname" header="Name" style="text-align: center;"></pv-column>
    <pv-column field="specialist" header="Specialist" style="text-align: center;"></pv-column>
    <pv-column field="workplace" header="Work place" style="text-align: center;"></pv-column>
    <pv-column field="recommendation" header="Recommendations" style="text-align: center;"></pv-column>
    <pv-column>
      <template #body="slotprops">
        <pv-button label="Ver perfil" class="p-button-outlined" @click="goEntry(slotprops.data)"></pv-button>
      </template>

    </pv-column>
  </pv-data-table>
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

 .column{
   text-align: center;
 }
</style>
