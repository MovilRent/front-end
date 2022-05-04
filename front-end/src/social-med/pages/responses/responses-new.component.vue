<template>
  <div>
    <div class="card">
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button
            label="View entry"
            icon=""
            class="p-button-primary p-button-outlined mr-2"
            @click="viewEntry"
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
      v-model="comment.content"
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
import { FilterMatchMode } from "primevue/api";
import { ForumApiService } from "../../services/forum.service";
import { CommentApiService } from "../../services/comment.service";
import { UserApiService } from "../../services/user.service";
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

    this.forumsService = new ForumApiService();
    this.forumsService.getAll().then((response) => {
      this.forums = response.data;
    });

    this.usersService = new UserApiService();
    this.usersService.getAll().then((response) => {
      this.users = response.data;
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

    viewEntry() {
      this.forum = this.forumsService.getById(this.$route.params.id);
      this.user = this.usersService.getById(this.forum.userId);

      this.commentDialog = true;
    },
    hideDialog() {
      this.commentDialog = false;
    },
    postComment() {
      var currentDate = new Date();

      this.comment = {
        forumId: this.$route.params.id,
        userId: this.user.id,
        //TEXTO DE PRUEBA, LUEGO CAMBIAR AL CONTENIDO QUE SE HA ESCRITO ARRIBA
        content: this.comment.content,
        //VARIABLE QUE SE LE ASIGNA LA FECHA ACTUAL
        date: currentDate,
      };
      this.commentsService.create(this.comment).then((response) => {
        this.comment = this.getDisplayableComment(response.data);
        this.comments.push(this.comment);
            });

      this.commentDialog = false;
      console.log(this.comment);
    },
  },
};
</script>

<style scoped></style>