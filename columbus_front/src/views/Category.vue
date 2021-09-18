<template>
  <div class="page-category">
    <div class="colums is-multiline">
      <div class="column is-12">
        <h2 class="is-size-2 hast-text-centered">{{ category.name }}</h2>
      </div>
    </div>
      <ProductBox v-for="product in category.products" v-bind:key="product.id" v-bind:product="product" />

    
  </div>
</template>
<script>
import axios from "axios";
import { toast } from "bulma-toast";
import ProductBox from '@/components/ProductBox'
export default {
  name: "Category",
  components:{
    ProductBox
  },
  data() {
    return {
      category: {
        products: [],
      },
    };
  },

  mounted() {
    this.getCategory();
  },
  watch: {
    $route(to,form){
      if(to.name === 'Category'){
        this.getCategory()
      }
    }
  },
  methods: {
    async getCategory() {
      const categorySlug = this.$route.params.category_slug;
      this.$store.commit("setIsLoading", true);
      await axios
        .get(`/api/v1/products/${categorySlug}`)
        .then((response) => {
          this.category = response.data;
          document.title = this.category.name;
        })
        .catch((error) => {
          console.log(error);
          toast({
            message: "Algo salio mal :(",
            type: "is-danger",
            dismissible: true,
            pauseOnHover: true,
            duration: 200,
            position: "bottom-right",
          });
        });
      this.$store.commit("setIsLoading", false);
    },
  },
};
</script>
