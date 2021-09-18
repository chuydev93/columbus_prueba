<template>
  <div class="page-log-in">
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <h1 class="title">Log in</h1>

        <!-- <form @submit.prevent="submitForm"> -->
        <form v-on:submit.prevent="login">
          <div class="field">
            <label>Email</label>
            <div class="control">
              <input type="text" class="input" v-model="username" />
            </div>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="control">
              <input type="password" class="input" v-model="password" />
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-dark">Log in</button>
            </div>
          </div>
          <div class="" v-if="errors.length">
            <p v-for="error in errors" v-bind:key="error" class="help is-danger">
              {{ error.mensaje }}
            </p>
          </div>
          <hr />

          O <router-link to="/sign-up">Registrate</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "LogIn",
  data() {
    return {
      username: "",
      password: "",
      errors: [],
    };
  },
  mounted() {
    document.title = "Log In";
  },
  methods: {
    // async submitForm() {
    //     axios.defaults.headers.common["Authorization"] = ""
    //     localStorage.removeItem("token")
    //     const formData = {
    //         username: this.username,
    //         password: this.password
    //     }
    //     await axios
    //         .post("/api/v1/token/login/", formData)
    //         .then(response => {
    //             const token = response.data.auth_token
    //             this.$store.commit('setToken', token)

    //             axios.defaults.headers.common["Authorization"] = "Token " + token
    //             localStorage.setItem("token", token)
    //             const toPath = this.$route.query.to || '/'
    //             this.$router.push(toPath)
    //         })
    //         .catch(error => {
    //             if (error.response) {
    //                 for (const property in error.response.data) {
    //                     this.errors.push(`${property}: ${error.response.data[property]}`)
    //                 }
    //             } else {
    //                 this.errors.push('Something went wrong. Please try again')

    //                 console.log(JSON.stringify(error))
    //             }
    //         })
    // }

    login() {
      this.errors = [];
      this.$store
        .dispatch("userLogin", {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          const toPath = this.$route.query.to || "/";
          this.$router.push(toPath);
        })
        .catch((err) => {
          if (err.response) {
            switch (err.response.status) {
              case 401:
                this.errors.push({ mensaje: "Usuario y/o Contraseña Incorrectos" });

                break;

              default:
                this.errors.push({
                  mensaje: "Algo salio mal consulte al administrador del sitio",
                });

                break;
            }
          } else {
            this.errors.push({
              mensaje: "Algo salio mal consulte al administrador del sitio",
            });
          }
        });
    },
  },
};
</script>
