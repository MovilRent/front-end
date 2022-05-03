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
               @click="newComment"
    />
    <h2>Respuestas ({{ comments.length }})</h2>
    <pv-data-table :value="comments" responsiveLayout="scroll">
      <pv-column field="author" header="Author"></pv-column>
      <pv-column field="content" header="Comentario" style="text-align: justify"/>
    </pv-data-table>
    </template>
  </pv-card>

  <pv-dialog
      v-model:visible="commentDialog"
      :style="{ width: '800px' }"
      header="Escribir una respuesta"
      :modal="true"
      class="p-fluid"
  >
    <h2 class="field">
        <span class="p-float-label">
          {{forum.title}}
        </span>
    </h2>
    <div class="field">
        <span class="p-float-label">
          Por: {{user.name}} {{user.last_name}}
        </span>
    </div>
    <div class="field">
        <span class="text-justify p-float-label">
          {{forum.content}}
        </span>
    </div>
    <div class="field">
        <span class="p-float-label">
          <pv-textarea
              id="content"
              required="false"
              rows="8"
              cols="2"
          />
          <label for="content">Escriba su respuesta aquí.</label>
        </span>
    </div>
    <template #footer>
      <pv-button
          label="Publicar"
          class="p-button-text"
          icon="pi pi-send"
          @click="postComment"
      />
    </template>
  </pv-dialog>
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
      commentDialog: false,
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
    findIndexById(id) {
      return this.forums.findIndex((forum) => forum.id === id);
    },
    getStorableComment(displayableComment) {
      return {
        id: displayableComment.id,
        forumId: displayableComment.forumId,
        userId: displayableComment.userId = 1,
        content: (displayableComment.content),
        date: (displayableComment.date = "02-12-2021"),
      };
    },
    closeDialog() {
      this.isDialogVisible = false;
    },
    newComment() {
      this.forum = {
        //
        //TEXTO DE PRUEBA - PARA VER SI EL DIALOG SE MUESTRA CON EL CONTENIDO - LUEGO CAMBIAR A BASE CON JSON
        //
        "id": 1,
        "userId": 1,
        "title": "Premio Grammy al mejor álbum de pop vocal tradicional",
        "content": "El premio Grammy al mejor álbum de pop vocal tradicional es un galardón otorgado a los artistas en el contexto de los premios Grammy, una ceremonia establecida en 1958 y llamada originalmente los premios Gramophone. Los reconocimientos en cada categoría son entregados en una ceremonia anual por The Recording Academy de los Estados Unidos con la intención de «distinguir los logros artísticos, la pericia técnica y la excelencia en general en la industria de la grabación, sin tener en cuenta la cantidad de ventas del álbum o su posición en las listas».",
        "date": "05-11-21"
      };
      this.user = {
        //
        //TEXTO DE PRUEBA - PARA VER SI EL DIALOG SE MUESTRA CON EL CONTENIDO - LUEGO CAMBIAR A BASE CON JSON
        //
        "id": 1,
        "name": "Ronaldo",
        "last_name": "Leon Huanquiri",
        "age": 20,
        "password": "123",
        "biography": "Los templos egipcios fueron construidos para el culto oficial de los dioses y la conmemoración"
      };
      this.commentDialog = true;
    },
    hideDialog() {
      this.commentDialog = false;
    },
    postComment() {
      this.forum.id = 0;
      this.comment = this.getStorableComment(this.comment);
      this.commentsService.create(this.comment).then((response) => {
        this.comment = this.getDisplayableComment(response.data);
        this.comments.push(this.comment);
      });
      this.commentDialog = false;
      this.forum = {};
    },
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
