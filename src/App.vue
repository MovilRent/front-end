<script>
export default {
  data() {
    return {
      items: [
        { label: "Home", to: "/home" },
        { label: "Forums", to: "/forums" },
        { label: "My profile", to: "/profile" },
        { label: "My entries", to: "/entrances" },
        { label: "Responses", to: "/responses" },
      ],
    };
  },
};
</script>

<template>
  <header>
    <pv-toolbar :style="'backgroundColor: #9CD4E7;'">
      <template #start>
        <img :src="'../media/logo.png'" class="logo"/>
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
              :StyleClass="Botones-nav"
              :style="'backgroundColor: #9CD4E7; borderColor: #9CD4E7; margin-right: 0.5rem; color: #000000;'"
              :href="href"
              @click="navigate"
              >{{ item.label }}</pv-button
            >
          </router-link>
        </div>
      </template>
    </pv-toolbar>
  </header>
  <RouterView />
</template>

<style>
.logo{
  width: 10rem;
  height: 3.5rem;
}

.p-input-icon-left{
  margin-left: 2rem;
}

</style>
