<template>
  <div>
    <div class="card">
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button
            label="Responder"
            icon=""
            class="p-button-primary p-button-outlined mr-2"
            @click="newComment"
          />
        </template>
      </pv-toolbar>
    </div>
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
  </div>
</template>

<script>
import { CommentApiService } from "../../services/comment.service";
export default {
  name: "responses-new.component",
  data() {
    return {
      forums: [],
      comments: [],
      users: [],
      commentDialog: false,
      forum: {},
      user: {},
      comment: {},
      forumsService: null,
      commentsService: null,
      usersService: null,
    };
  },
  created() {
    this.commentsService = new CommentApiService();
    this.commentsService.getAll().then((response) => {
      this.comments = response.data;
    });
  },
  methods: {
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

    //
    //TEXTO DE PRUEBA - PARA VER SI EL DIALOG SE MUESTRA CON EL CONTENIDO - LUEGO CAMBIAR A BASE CON JSON
    //
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

<style scoped></style>