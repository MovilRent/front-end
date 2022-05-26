<template>
  <div
    class="card-container blue-container flex align-items-center justify-content-start"
  >
    <div>
      <h2>My Contacts</h2>
      <pv-list-box
        v-model="selectedContact"
        :options="contacts"
        :multiple="true"
        :filter="true"
        optionLabel="name"
        listStyle="max-height:250px"
        style="width: 20rem"
        filterPlaceholder="Search"
      >
      </pv-list-box>
    </div>

    <div class="chat-container">
      <div class="block bg-gray-50 font-bold text-center p-4 border-round mb-3">
        <div v-for="message in messages" :key="message.id">
          <b>
            {{ message.user }}
          </b>
          : {{ message.text }}
        </div>
      </div>
      <div
        class="bottom-0 right-0 bg-white-500 font-bold text-center p-4 border-round mb-3"
      >
        <textarea
          v-model="text"
          class="text-message"
          v-on:keyup.enter="sendMessage"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { UserApiService } from "../../services/user-api.service";
import { io } from "socket.io-client";

export default {
  name: "contacts-view.component",
  data() {
    return {
      selectedContact: null,
      userService: null,
      selectedName: "",
      contacts: [],

      joined: false,
      text: "",
      messages: [],
    };
  },
  created() {
    this.userService = new UserApiService();
    this.userService.getAll().then((response) => {
      this.contacts = response.data;
      console.log(this.contacts[0].name);
    });
    this.join();
  },
  methods: {
    join() {
      this.joined = true;
      this.socketInstance = io("http://localhost:4800");
      this.socketInstance.on("message:received", (data) => {
        this.messages = this.messages.concat(data);
      });
    },
    sendMessage() {
      this.addMessage();
      this.text = "";
    },
    addMessage() {
      const message = {
        id: new Date().getTime(),
        text: this.text,
        user: this.selectedContact[0].name,
      };
      this.messages = this.messages.concat(message);
      this.socketInstance.emit("message", message);
    },
  },
};
</script>

<style scoped>
.chat-container {
  width: 80vw;
  max-height: max-content;
  height: 35vw;
  min-width: 30vw;
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
}
.text-message {
  width: 30vw;
  height: 3vw;
}
</style>
