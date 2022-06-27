<script>
import { UserApiService } from "./social-med/services/user-api.service";
import { StorageService } from "./core/services/storage.service";

export default {
  data() {
    return {
      storage: null,
      iniciosesion: false,
      loginDialog: false,
      submitted: false,
      submittedLogin: false,
      coincidencia: false,
      incorrecto: false,
      usuario: "",
      user: {},
      contrasena: "",
      opciones: ["Sign in", "Sign up"],
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
  },
  methods: {
    openDialog(){
      this.incorrecto = false
      this.submittedLogin = false
      this.coincidencia = false
      this.user = {}
      this.submitted = false
      this.loginDialog = true
      this.usuario = ""
      this.contrasena = ""
    },
    iniciarSesion(){
      this.submittedLogin = true
      this.usuarioApiService.getByUsernameAndPassword(this.usuario, this.contrasena).then(response =>{
        if(response.data.length === 0){
          this.incorrecto = true
          this.$toast.add({
            severity: "error",
            summary: "Inicio de sesión fallido",
            detail: "El correo electrónico y/o la contraseña ingresada no son correctos",
            life: 3000,
          });
        }
        else{
          this.$toast.add({
            severity: "success",
            summary: "Sesión iniciada correctamente",
            life: 3000,
          });
          this.iniciosesion = true
          this.loginDialog = false
          console.log(response.data)
          this.storageService.set("usuario", response.data.id)
          this.storageService.set("nombre", response.data.name)
        }
      })
    },
    Registrarse(){
      this.submitted = true;
      if(this.user.name || this.user.email || this.user.password || this.user.ruc){
        this.usuarioApiService.create(this.user).then(response => {
          this.storageService.set("usuario", response.data.id)
          this.storageService.set("nombre", response.data.name)
          this.$toast.add({
            severity: "success",
            summary: "Registrado correctamente",
            detail: "Sesión iniciada",
            life: 3000,
          });
          this.loginDialog = false
          this.iniciosesion = true
        })
      }
      else{
        this.$toast.add({
          severity: "error",
          summary: "Registro fallido",
          detail: "Ingrese todos los datos correctamente",
          life: 3000,
        });
      }
    }
  },

};
</script>

<template>
  <pv-toast />
    <pv-toolbar :style="'backgroundColor: #9CD4E7;'">
      <template #start>
        <img :src="'../media/logo.png'" class="logo" />
      </template>
      <template #end>
        <div v-if="iniciosesion" class="flex-column">
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
        <div v-else>
          <pv-button
            icon="pi pi-user"
            label="Iniciar sesión"
             @click="openDialog"
            :style="'backgroundColor: #9CD4E7; borderColor: #9CD4E7; margin-right: 0.5rem; color: #000000;'"
          />
        </div>
      </template>
    </pv-toolbar>
    <pv-dialog
      v-model:visible="loginDialog"
      :style="{ width: '600px' }"
      :modal="true"
      class="p-fluid"
    >
      <pv-select-button class="mt-1 w-full" v-model="inicioOpcion" :options="opciones" />
      <div v-if="inicioOpcion === 'Iniciar sesión'" class="w-full">
        <pv-card class="mt-3 surface-card p-4 shadow-2 border-round w-full">
          <template #content>
            <div class="text-center mb-5">
              <div class="text-900 text-3xl font-medium mb-3">Sign in</div>
            </div>

            <div>
              <label for="email1" class="block text-900 font-medium mb-2">Email</label>
              <pv-input-text id="email1" type="text" v-model="usuario" class="w-full mb-3" :class="{ 'p-invalid': submittedLogin && incorrecto }"/>

              <label for="password1" class="block text-900 font-medium mb-2">Password</label>
              <pv-input-text id="password1" type="password" v-model="contrasena" class="w-full mb-3" :class="{ 'p-invalid': submittedLogin && incorrecto }" />
              <small class="p-error" v-if="submittedLogin && incorrecto"
              >The email or password are incorrect</small>
              <pv-button label="Sign in " @click="iniciarSesion" class="mt-3 w-full"></pv-button>
            </div>
          </template>
        </pv-card>
      </div>
      <div v-else class="w-full">
        <pv-card class="mt-3 surface-card p-4 shadow-2 border-round w-full">
          <template #content>
            <div class="text-center mb-5">
              <div class="text-900 text-3xl font-medium mb-3">Sign up</div>
            </div>

            <div>
              <label class="block text-900 font-medium mb-2 mt-3">Email</label>
              <pv-input-text v-model="user.email" type="text" class="w-full" :class="{ 'p-invalid': submitted && !user.email || submitted && coincidencia }"/>
              <small class="p-error" v-if="submitted && !user.email"
              >Email is required</small>
              <small class="p-error" v-if="submitted && coincidencia"
              >Email already exists</small>

              <label class="block text-900 font-medium mb-2 mt-3">Password</label>
              <pv-input-text v-model="user.password" type="password" class="w-full" :class="{ 'p-invalid': submitted && !user.password }"/>
              <small class="p-error" v-if="submitted && !user.password"
              >Password is required</small>

              <label class="block text-900 font-medium mb-2 mt-3">Name</label>
              <pv-input-text v-model="user.name" type="text" class="w-full" :class="{ 'p-invalid': submitted && !user.name }"/>
              <small class="p-error" v-if="submitted && !user.name"
              >Name is required</small>

              <label  class="block text-900 font-medium mb-2 mt-3">Lastname</label>
              <pv-input-text v-model="user.lastname" type="text" class="w-full" :class="{ 'p-invalid': submitted && !user.lastname }"/>
              <small class="p-error" v-if="submitted && !user.lastname"
              >Lastname is required</small>

              <label  class="block text-900 font-medium mb-2 mt-3">Age</label>
              <pv-input-text v-model="user.age" type="text" class="w-full" :class="{ 'p-invalid': submitted && !user.age }"/>
              <small class="p-error" v-if="submitted && !user.age"
              >Age is required</small>

              <label  class="block text-900 font-medium mb-2 mt-3">Specialist</label>
              <pv-input-text v-model="user.specialist" type="text" class="w-full" :class="{ 'p-invalid': submitted && !user.specialist }"/>
              <small class="p-error" v-if="submitted && !user.specialist"
              >Specialist is required</small>

              <label  class="block text-900 font-medium mb-2 mt-3">Work place</label>
              <pv-input-text v-model="user.workplace" type="text" class="w-full" :class="{ 'p-invalid': submitted && !user.workplace }"/>
              <small class="p-error" v-if="submitted && !user.workplace"
              >Work place is required</small>

              <label  class="block text-900 font-medium mb-2 mt-3">Biography</label>
              <pv-textarea :autoResize="true"
                           rows="2"
                           cols="100" v-model="user.biography" type="text" class="w-full" :class="{ 'p-invalid': submitted && !user.biography }"/>
              <small class="p-error" v-if="submitted && !user.biography"
              >Biography is required</small>

              <pv-button label="Sign up" @click="Registrarse" class="mt-3 w-full"></pv-button>
            </div>
          </template>
        </pv-card>
      </div>
    </pv-dialog>

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
