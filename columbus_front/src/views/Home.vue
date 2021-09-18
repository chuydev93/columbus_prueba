<template>
  <div class="home">
    <section class="hero is-medium is-dark mb-6">
      <div class="hero-body has-text-centered">
        <p class="title mb-6">Bienvenido a Columbus Store</p>
      </div>
    </section>

    <div class="columns is-multiline">
      <!-- <div class="column is-12">
        <div class="tags has-addons is-pulled-right">
          <span class="tag is-info">Vista</span>
          <span @click="perPage = 10" class="tag is-light">10</span>
          <span @click="perPage = 20" class="tag is-light">20</span>
          <span @click="perPage = 30" class="tag is-light">30</span>
        </div>
      </div> -->

      <div class="column is-12 ">
        <div class="field is-horizontal is-pulled-right">
          <div class="field-label is-normal">
            <label class="label">Vista</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded has-icons-left">
              <button @click="changePerPage(10)" class="button">10</button>
              <button @click="changePerPage(20)" class="button">20</button>
              <button @click="changePerPage(30)" class="button">30</button>
              
              </p>
            </div>
            
          </div>
        </div>
      </div>

      <ProductBox
        v-for="product in displayedElements"
        v-bind:key="product.id"
        v-bind:product="product"
      />
      <div class="column is-12 has-text-centered">
        <button class="button" type="button" v-if="page != 1" @click="page--">
          <i class="fas fa-caret-left"></i>
        </button>
        <button
          @click="page = pageNumber"
          v-for="pageNumber in pages.slice(page - 1, page + 8)"
          :key="pageNumber"
          class="button"
        >
          {{ pageNumber }}
        </button>
        <button class="button" type="button" v-if="page < pages.length" @click="page++">
          <i class="fas fa-caret-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProductBox from "@/components/ProductBox";

export default {
  name: "Home",
  data() {
    return {
      latestProducts: [],
      page: 1,
      perPage: 10,
      pages: [],
    };
  },
  components: {
    ProductBox,
  },
  mounted() {
    this.getLatestProducts();
    this.setArticles();
  },
  watch: {
    latestProducts() {
      this.setArticles();
    },
  },
  methods: {
    async getLatestProducts() {
      this.$store.commit("setIsLoading", true);

      await axios
        .get("/api/v1/latest-products/", { headers: { Authorization: `Bearer ${this.$store.state.accessToken}` } })
        .then((response) => {
          this.latestProducts = response.data;
          document.title = "Home";
        })
        .catch((error) => {
          console.log(error);
        });
      this.$store.commit("setIsLoading", false);
    },
    setArticles() {
       this.pages = [];
      let numberOfPages = Math.ceil(this.latestProducts.length / this.perPage);
      for (let i = 1; i <= numberOfPages; i++) {
        this.pages.push(i);
      }
    },
    paginate(elements) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return elements.slice(from, to);
    },
    changePerPage(num){
      this.perPage = num;
      this.setArticles();

    }
  },

  computed: {
    displayedElements: function () {
      return this.paginate(this.latestProducts);
    },
  },
};
</script>
