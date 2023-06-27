export default {
  mongoURI: "mongodb://127.0.0.1:27017/ascloud",
  mainServer: {
    port: 3030,
    url: "http://localhost:3030",
  },
  fileServer: {
    port: 8080,
    url: "http://localhost:8080",
  },
  sessions: {
    secret: "watermelon",
    cookieSecure: false,
    cookieMaxAge: 604800000,
  },
  emailClient: {
    user: "asterki.dev@proton.me",
    pass: "ejqwieoqw",
    service: "Gmail",
  },
};
