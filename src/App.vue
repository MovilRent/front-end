<script>
import { UserApiService } from "./social-med/services/user-api.service";
import { StorageService } from "./core/services/storage.service";

export default {
  data() {
    return {
      storage: null,
      items: [
        { label: "Home", to: "/home" },
        { label: "Forums", to: "/forums" },
        { label: "My entries", to: "/entrances" },
        { label: "Report Errors", to: "/report-bugs" },
      ],
    };
  },
  created() {
    this.storage = new StorageService()
  }
};
</script>

<template>
  <header>
    <pv-toolbar :style="'backgroundColor: #9CD4E7;'">
      <template #start>
        <img :src="'../media/logo.png'" class="logo" />
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <pv-input-text type="text" v-model="value1" placeholder="Search" />
        </span>
      </template>
      <template #end>
        <div class="flex-column">
          <router-link
            v-for="item in items"
            :to="item.to"
            custom
            v-slot="{ navigate, href }"
            :key="item.label"
          >
            <pv-button
              :StyleClass="Botones - nav"
              :style="'backgroundColor: #9CD4E7; borderColor: #9CD4E7; margin-right: 0.5rem; color: #000000;'"
              :href="href"
              @click="navigate"
              >{{ item.label }}</pv-button>
          </router-link>
          <router-link
            :to="'/profile/1'"
            style="text-decoration: none"
          >
            <pv-button
              icon="pi pi-user"
              @click="this.storage.set('profile', 1)"
              :style="'backgroundColor: #9CD4E7; borderColor: #9CD4E7; margin-right: 0.5rem; color: #000000;'"
            ></pv-button>
          </router-link>
          <router-link to="/contacts" style="text-decoration: none">
            <pv-button
              icon="pi pi-comment"
              :style="'backgroundColor: #9CD4E7; borderColor: #9CD4E7; margin-right: 0.5rem; color: #000000;'"
            />
          </router-link>
          <router-link to="/notifications" style="text-decoration: none">
            <pv-button
              icon="pi pi-bell"
              :style="'backgroundColor: #9CD4E7; borderColor: #9CD4E7; margin-right: 0.5rem; color: #000000;'"
            />
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>
  <RouterView />
</template>

<style>
.logo {
  width: 10rem;
  height: 3.5rem;
}

.p-input-icon-left {
  margin-left: 2rem;
}
</style>
