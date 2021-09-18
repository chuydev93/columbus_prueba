<template>
    <div class="page-product">
        <div class="columns is-multiline">
            <div class="column is-8">
                <figure class=" mb-6">
                    <img v-bind:src="product.get_thumbnail">
                </figure>
                <h1 class="title">{{product.name}}</h1>
                <p>{{product.description}}</p>
            </div>
            <div class="column is-3">
                <h2 class="subtitle">Información</h2>
                <p><strong>Precio:</strong>${{product.price}}</p>
                <div class="field has-addons mt-6">
                    <div class="control">
                        <input type="number" min="1" v-model="quantity" class="input">
                    </div>
                    <div class="control">
                        <a  class="button is-dark" @click="addToCart()"><i class="fas fa-shopping-cart"></i></a>
                    </div>
                </div>
            </div>

        </div>
        
    </div>
</template>
<script>
import axios from 'axios'
import {toast} from 'bulma-toast'
export default {
    name: 'Product',
    data() {
        return{
            product:{},
            quantity:1

        }
    },
    mounted(){
        this.getProduct()
    },
    methods: {

        async getProduct(){
            
            this.$store.commit('setIsLoading',true)
            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug
           await axios.get(`/api/v1/products/${category_slug}/${product_slug}`,{ headers: { Authorization: `Bearer ${this.$store.state.accessToken}` } }).then(response=>{
               console.log(response)
                this.product = response.data
                document.title = this.product.name
            }).catch(error=>{
                console.log(error)
            })
            this.$store.commit('setIsLoading',false)

        },
        addToCart(){
            
           if (isNaN(this.quantity) || this.quantity < 1) {
                this.quantity = 1
            }
            const item = {
                product: this.product,
                quantity: this.quantity
            }
            this.$store.commit('addToCart', item)

            toast({
                message: "El producto fue agregado al carrito",
                type: 'is-success',
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: 'bottom-right'
            })
        }
    },

    
}
</script>