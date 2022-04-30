<template>
  <pv-data-table :value="forums">
    <template #header>
      <div>Entradas recomendadas para ti</div>
    </template>
    <pv-column field="title" header="Title"></pv-column>
    <pv-column field="description" header="Description"></pv-column>
    <pv-column field="author" header="Author"></pv-column>
  </pv-data-table>
  <pv-divider />
  <pv-data-table :value="forums">
    <template #header>
      <div>Médicos recomendadas para ti</div>
    </template>
    <pv-column field="title" header="Title"></pv-column>
    <pv-column field="description" header="Description"></pv-column>
    <pv-column field="author" header="Author"></pv-column>
  </pv-data-table>
</template>

<script>
import { ForumApiService } from "../../services/forum.service";

export default {
  name: "beginning-home.component",
  data(){
    return{
      forums: {},
      forumsService: null,
      layout: "list"
    }
  },
  created() {
    this.forumsService = new ForumApiService();
    this.forumsService.getAll().then((response) => {
      this.forums = response.data();
    });
  },
};
</script>

<style scoped></style>
