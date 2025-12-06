import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  {
    path: "event/:id",
    file: "routes/event.$id.tsx",
  },

  {
    path: "events",
    file: "routes/events.tsx",
  },

  {
    path: "locations",
    file: "routes/locations.tsx"
  },

  {
    path: "login",
    file: "routes/login.tsx"
  },

  {
    path: "signup",
    file: "routes/signup.tsx"
  }

] satisfies RouteConfig;
