<template>
  <pv-card class="card">
    <template #content>
    <h1>{{ title }}</h1>
    <p>Por: {{ author }}</p>
    <p>{{ description }}</p>
    <pv-rating :modelValue=promval :cancel="false" :readonly="true" />
      <p>Rating: {{ promval }} stars</p>
    <pv-button id="answer-btn"
               class="p-button-rounded p-button-raised p-button-info"
               label="Responder"
               @click="newComment"
    />
    <h2>Comments: ({{ comments.length }})</h2>
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
          {{ title }}
        </span>
    </h2>
    <div class="field">
        <span class="p-float-label">
          Por: {{ author }}
        </span>
    </div>
    <div class="field">
        <span class="text-justify p-float-label">
          {{ description }}
        </span>
    </div>
    <div class="field">
        <span class="p-float-label">
          <pv-textarea
              id="content"
              v-model="comment.content"
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
import { ForumApiService } from "../../services/forum.service";
import { RatingApiService } from "../../services/rating.service";

export default {
  name: "responses-new.component",
  data() {
    return {
      commentsApi: null,
      usersApi: null,
      forumsApi: null,
      ratingApi: null,
      title: "",
      author: "",
      description: "",
      vals: {},
      promval: 0,
      commentDialog: false,
      comments: {},
      comment: {},
      errors: {},
      isValDisabled: false,
      isDialogVisible: false,
      users: {},
      fecha: null
    };
  },
  created() {
    this.fecha = new Date();
    this.commentsApi = new CommentApiService();
    this.usersApi = new UserApiService();
    this.forumsApi = new ForumApiService();
    this.ratingApi = new RatingApiService();
    this.title = this.$route.params.title;
    this.description = this.$route.params.content;
    this.getEntryAuthor(this.$route.params.userId);
    this.getCommentsToPost();
    this.getUsers();
    this.getAverageValoration();
  },
  methods: {
    getEntryAuthor(id) {
      this.usersApi.getById(id).then((response) => {
        this.author = response.data.name + " " + response.data.lastname;
      });
    },
    getCommentsToPost() {
      this.commentsApi
          .getByForumId(this.$route.params.id)
          .then((response) => {
            this.comments = response.data;
            this.comments.forEach((comment) => {
              this.usersApi.getById(comment.userId).then((response) => {
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
            this.users.forEach((user) => {
              user.fullname = user.name + " " + user.lastname;
            })
            console.log(this.users);
          })
          .catch((error) => {
            this.errors.push(error);
            console.log(error);
          });
    },
    getAverageValoration() {
          this.ratingApi.getByForumId(this.$route.params.id).then((response) => {
            this.promval = 0;
            this.vals = response.data;
            if (this.vals.length !== 0) {
              this.vals.forEach((val) => {
                this.promval += val.rating.valueOf()
              })
              this.promval /= this.vals.length;
              this.promval.toFixed(2);
            }
          })
    },
    findIndexById(id) {
      return this.forums.findIndex((forum) => forum.id === id);
    },
    getStorableComment(displayableComment) {
      return {
        id: displayableComment.id,
        forumId: this.$route.params.id,
        userId: displayableComment.userId = 1,
        content: (displayableComment.content),
        date: displayableComment.date = this.fecha.getDate() + "-" + (this.fecha.getMonth() + 1) + "-" + this.fecha.getFullYear(),
      };

    },
    getDisplayableComment(comment){

      return comment;
    },
    newComment(){
      this.commentDialog = true;
    },

    hideDialog() {
      this.commentDialog = false;
    },
    postComment() {
      this.comment.id = 0;
      this.comment = this.getStorableComment(this.comment);
      this.commentsApi.create(this.comment).then((response) => {
        this.usersApi.getById(this.comment.userId).then( (response) => {
          this.comment.author = response.data.name + " " + response.data.lastname;
        })
        this.comment = this.getDisplayableComment(response.data);
        this.comments.push(this.comment);
      });

      this.commentDialog = false;
      console.log(this.comment);
    },
  }
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
