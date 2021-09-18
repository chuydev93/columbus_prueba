import { createStore } from 'vuex'
import axios from 'axios'


export default createStore({
  state: {
    cart: {
      items: [],
    },
    isAuthenticated: false,
    token: '',
    isLoading: false,
    accessToken: null,
    refreshToken: null,

  },
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart'))
      } else {
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }
      if (localStorage.getItem('token')) {
        state.accessToken = localStorage.getItem('token')
        state.isAuthenticated = true
      } else {
        state.accessToken = null
        state.isAuthenticated = false
      }

    },
    addToCart(state, item) {
      const exsist = state.cart.items.filter(i => i.product.id === item.product.id)
      if (exsist.length) {
        exsist[0].quantity = parseInt(exsist[0].quantity) + parseInt(item.quantity)

      } else {
        state.cart.items.push(item)
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    setIsLoading(state, status) {

      state.isLoading = status
    },
    // setToken(state, token) {
    //   state.token = token
    //   state.isAuthenticated = true
    // },
    // removeToken(state) {
    //   state.token = ''
    //   state.isAuthenticated = false
    // },
    updateStorage (state, { access, refresh }) {
      state.accessToken = access
      state.refreshToken = refresh
      state.isAuthenticated = true
  
      localStorage.setItem("token", state.accessToken)
    },
    destroyToken (state) {
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false

    }
  },
  getters: {
    loggedIn (state) {
  
      return state.accessToken != null
    }
  },
  actions: {
    userLogout (context) {
      if (context.getters.loggedIn) {
          context.commit('destroyToken')
          localStorage.removeItem("token")
         
      }
    },
    userLogin (context, usercredentials) {
      return new Promise((resolve, reject) => {
        axios.post('/api-token/', {
          username: usercredentials.username,
          password: usercredentials.password
        })
          .then(response => {
            context.commit('updateStorage', { access: response.data.access, refresh: response.data.refresh }) 
            resolve()
          })
          .catch(err => {
           
            reject(err)
          })
      })
    }
  },
  modules: {
  }
})
