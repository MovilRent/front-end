<template>
<div class="grid">
 <div class="col-12 p-fluid">
  <pv-card class="card">
    <template #content>
    <h1>Report an Error</h1>
    <div class="field">
        <span class="p-float-label">
          Insert a tittle
        </span>
    </div>
    <div class="field">
        <span class="p-float-label">
          <pv-textarea
              id="title"
              required="false"
              rows="2"
              cols="100"
          />
        </span>
    </div>
    <div class="field">
        <span class="p-float-label">
          Insert a description
        </span>
    </div>
    <div class="field">
        <span class="p-float-label">
          <pv-textarea
              id="content"
              required="false"
              rows="10"
              cols="100"
          />
        </span>
    </div>
    <div class="col-12 md:col-2 p-fluid">
     <pv-button
          label="Send Report"
          class="p-button-raised p-button-rounded"
          icon="pi pi-check" 
          iconPos="right"
          @click="postReport"
     />
    </div>
    </template>
  </pv-card>
 </div>
</div>
</template>

<script>
import { ReportsApiService } from "../../services/reports-api.service";

export default {
  name: "report-bugs.component",
  data() {
    return {
      reportsApi: null,
      reports: {},
      report: {},
      title: "",
      description: "",
    };
  },
  created() {
    this.reportsApi = new ReportsApiService();
    this.title = this.$route.params.title;
    this.description = this.$route.params.description;
  },
  methods: {

    getStorableReport(displayableReport) {
      return {
        id: displayableReport.id,
        tittle: displayableReport.title,
        content: displayableReport.content,
      };

    },
    getDisplayableReport(report){

      return report;
    },

    postReport() {
      this.report.id = 0;
      this.report = this.getStorableReport(this.report);
      this.reportsApi.create(this.report).then((response) => {

        this.report = this.getDisplayableReport(response.data);
        this.reports.push(this.report);
      });

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
