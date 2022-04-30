import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/1",
      name: "home1",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/",
      redirect: "home",
    },
    {
      path: "/home",
      name: "home",
      component: () =>
        import("../social-med/pages/home/beginning-home.component.vue"),
    },
    {
      path: "/forums",
      name: "forums",
      component: () =>
        import("../social-med/pages/forums/forums-views.component.vue"),
    },
    {
      path: "/entrances",
      name: "entrances",
      component: () =>
        import("../social-med/pages/entrances/entrances-new.component.vue"),
    },
    {
      path: "/responses",
      name: "responses",
      component: () =>
        import("../social-med/pages/responses/responses-new.component.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () =>
        import("../social-med/pages/profile/profile-view.component.vue"),
    },
    {
      path: "/report-bugs",
      name: "report-bugs",
      component: () =>
        import("../social-med/pages/reports/report-bugs.component.vue"),
    },
  ],
});

export default router;
