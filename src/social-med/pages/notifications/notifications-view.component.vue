<template>
  <div>
    <pv-card>
      <template #title>Notificaciones</template>
      <template #content>
        <pv-data-table
          ref="dt"
          :value="displayableNotifications"
          dataKey="id"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 15]"
          responsiveLayout="scroll"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} notificaciones"
        >
          <template #header>
            <h2 class="m-0">Nuevas notificaciones ({{notifications.length}})</h2>
          </template>
          <pv-column>
            <template #body="slotProps">
              <img :src="slotProps.data.userImage" class="doctor-image"/>
            </template>
          </pv-column>
          <pv-column field="title" :sortable="false" />
          <pv-column field="userDescription" :sortable="false" />
          <pv-column>
            <template #body="slotProps">
              <div v-for="action in slotProps.data.actions" :key="action.key">
                <router-link v-if="action.actionCode===1" to="/profile">
                  <pv-button  :label="action.desc" style="margin: 0.7rem" class="p-button-outlined"></pv-button>
                </router-link>
                <router-link v-else-if="action.actionCode===3" :to="{ name: 'responses', params: {id: 1, userId: 1} }">
                  <pv-button :label="action.desc" style="margin: 0.7rem" class="p-button-outlined"></pv-button>
                </router-link>
                <router-link v-else to="/home">
                  <pv-button  :label="action.desc" style="margin: 0.7rem" class="p-button-outlined"></pv-button>
                </router-link>
              </div>
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>
  </div>
</template>

<script>
import { NotificationApiService } from "../../services/notification-api.service";
import { UserApiService } from "../../services/user-api.service";

export default {
  name: "notifications-view",
  data() {
    return {
      notifications: [],
      displayableNotifications: [],
      notificationsApi: new NotificationApiService(),
      usersApi: new UserApiService(),
      dataColumns: [
        { num: 1, field: "title" },
        { num: 2, field: "userId" },
      ]
    };
  },
  created() {
    this.getAllNotifications();
  },
  methods: {
    getAllNotifications() {
      this.notificationsApi.getAll().then((response) => {
        this.notifications = response.data;
        console.log(this.notifications.length);
        this.getDisplayableNotifications();
      });
    },
    getDisplayableNotifications() {
      this.notifications.forEach((notification) => {
        this.usersApi.getById(notification.userId).then((response) => {
          this.displayableNotifications.push({
            id: notification.id,
            userImage: "../media/" + response.data.image,
            title: `${response.data.name} ${response.data.lastname} ${notification.title}`,
            userDescription: `${response.data.specialist}\n${response.data.workplace}`,
            actions: notification.actions
          });
        });
      });
      console.log(this.displayableNotifications);
    },
  },
};
</script>

<style scoped>
.doctor-image{
  width:7rem;
  height: 7rem;
  border-radius: 50%;
  border: solid 1px #000000
}
</style>
