<template>
  <pv-card class="card">
    <template #content>
    <h1>{{ title }}</h1>
    <p>Por: {{ author }}</p>
    <p>{{ description }}</p>
    <pv-toolbar>
      <template #start>
        <p>{{ promval }}</p>
        <pv-rating :modelValue="1" :readonly="true" :stars="1" :cancel="false"></pv-rating>
        <div class="spacer"></div>
        <pv-rating v-model="val"/>
        <h3 class="value-temp">{{val}}</h3>
        <div class="spacer"></div>
        <pv-button icon="pi pi-send" class="p-button-rounded p-button-outlined" @click="postRating"/>
      </template>
      <template #end></template>
    </pv-toolbar>

    <pv-button id="answer-btn"
               class="p-button-rounded p-button-raised p-button-info"
               label="Reply"
               @click="newComment"
    />
    <h2>Comments: ({{ comments.length }})</h2>
    <pv-data-table :value="comments" responsiveLayout="scroll">
      <pv-column field="author" header="Author"></pv-column>
      <pv-column field="content" header="Comment" style="text-align: justify"/>
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
import { CommentApiService } from "../../services/comment-api.service";
import { UserApiService } from "../../services/user-api.service";
import { ForumApiService } from "../../services/forum-api.service";
import { RatingApiService } from "../../services/rating-api.service";

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
      fecha: null,
      ratings: {},
      rating: {},
      submit: null,
      val: 0
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
    this.getRatingsToPost();
    this.getUsers();
    this.getAverageValoration();
    this.submit = false;
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
    getRatingsToPost() {
      this.ratingApi.getByForumId(this.$route.params.id).then((response) => {
        this.ratings = response.data;
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
        userId: (displayableComment.userId = 1),
        content: (displayableComment.content),
        date: (displayableComment.date =
          this.fecha.getDate() +
          "-" +
          (this.fecha.getMonth() + 1) +
          "-" +
          this.fecha.getFullYear()),
      };

    },
    getStorableRating(displayableRating) {
      return {
        id: displayableRating.id,
        forumId: this.$route.params.id,
        rating: displayableRating.rating,
      };
    },
    getDisplayableComment(comment){
      return comment;
    },
    getDisplayableRating(rating){
      return rating;
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

    postRating() {
      if (this.val != null && this.val > 0){
        this.rating = this.getStorableRating(this.rating)
        this.ratingApi.create(this.rating).then((response) => {
          this.forumsApi.getById(this.rating.forumId).then((response) => {
            this.rating.rating = this.val;
            console.log(response.data);

          });
          this.rating = this.getDisplayableRating(response.data);
          this.ratings.push(this.rating);
        });
      }


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
.spacer{
  margin-left: 1.2rem;
}

.card{
  margin-top: 2rem;
}
.value-temp{
  margin:0;
  margin-left: 0.5rem;
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
