<template>
  <pv-card class="card">
    <template #content>
    <h1>{{ title }}</h1>
    <p>Por: {{ author }}</p>
    <p>{{ description }}</p>
    <pv-rating v-model="val" :cancel="false" :disabled="isValDisabled" />
    <pv-dialog header="Calificación a la entrada" :visible="isDialogVisible" :closable="false">
      <p>Tu calificación a la entrada es de {{val}} estrellas.</p>
      <template #footer>
        <pv-button class="p-button-rounded p-button-raised p-button-info" label="OK" @click="closeDialog()"/>
      </template>
    </pv-dialog>
    <pv-button id="answer-btn"
               class="p-button-rounded p-button-raised p-button-info"
               label="Responder"
    />
    <h2>Respuestas ({{ comments.length }})</h2>
    <pv-data-table :value="comments" responsiveLayout="scroll">
      <pv-column field="author" header="Author"></pv-column>
      <pv-column field="content" header="Comentario" style="text-align: justify"/>
    </pv-data-table>
    </template>
  </pv-card>
</template>

<script>
import { CommentApiService } from "../../services/comment.service";
import { UserApiService } from "../../services/user.service";

export default {
  name: "responses-new.component",
  data() {
    return {
      commentsApi: new CommentApiService(),
      usersApi: new UserApiService(),
      title: "¿Cuándo va a terminar la pandemia del COVID-19?",
      author: "María Rosales",
      description:
        "Cada día vemos que los gobiernos dejan de usar las medidas preventivas contra la COVID-19. Sin embargo, en el Perú todavía se siguen implementando. ¿Ustedes cuándo piensan que va a terminar la pandemia del COVID-19 en el Perú?",
      promVal: 0,
      val: 0,
      comments: {},
      errors: {},
      isValDisabled: false,
      isDialogVisible: false,
      users : {},
    };
  },
  created() {
    this.getCommentsToPost();
    this.getUsers();
    this.promVal = this.getAverageValoration([3, 4, 5, 5, 5]); //arreglo ejemplo, ahí irá un arreglo de calificaciones
  },
  methods: {
    getCommentsToPost() {
      this.commentsApi
        .getAll()
        .then((response) => {
          this.comments = response.data;
          this.comments.forEach( (comment) => {
            this.usersApi.getById(comment.userId).then( (response) => {
              comment.author = response.data.name + " " + response.data.lastname;
            });
          })
          console.log(response.data);
        })
    },
    getUsers() {
      this.usersApi
        .getAll()
        .then((response) => {
          this.users = response.data;
          this.users.forEach( (user) => {
            user.fullname = user.name + " " + user.lastname;
          })
          console.log(this.users);
        })
        .catch((error) => {
          this.errors.push(error);
          console.log(error);
        });
    },
    getAverageValoration(valorations) {
      let i = 0,
        sum = 0,
        length = valorations.length;
      while (i < length) {
        sum += valorations[i++];
      }
      return sum / length;
    },
    submitValoration() {
      this.isValDisabled = true;
      this.isDialogVisible = true;
    },
    closeDialog() {
      this.isDialogVisible = false;
    }
  },
};
</script>

<style scoped>
@font-face {
  font-family: "Roboto", sans-serif;
  src: url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap");
}
* {
  font-family: "Roboto", sans-serif;
}
i {
  color:blue;
}
h3 {
  margin-left: 10px;
  margin-top: 10px;
}

.card{
  margin-top: 2rem;
}

#answer-btn {
  margin-left: 80%;
}
@media (max-width: 415px) {
  #answer-btn {
    margin-left: 70%;
  }
}
</style>
