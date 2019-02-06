<template>
  <div id="form">
    <form>
    <div v-if="step === 1">

      <h1>Step One</h1>
      <div>
        <legend for="name">Your Name:</legend>
        <input id="name" name="name" v-model="registration.name">
      </div>

      <div>
      <legend for="email">Your Email:</legend>
      <input id="email" name="email" type="email" v-model="registration.email">
      </div>

      <button @click.prevent="next()">Next</button>
      
    </div>

    <div v-if="step === 2">
      <h1>Step Two</h1>
      <div>
      <legend for="street">Your Street:</legend>
      <input id="street" name="street" v-model="registration.street">
      </div>

      <div>
      <legend for="city">Your City:</legend>
      <input id="city" name="city" v-model="registration.city">
      </div>

      <div>
      <legend for="state">Your State:</legend>
      <input id="state" name="state" v-model="registration.state">
      </div>

      <button @click.prevent="prev()">Previous</button>
      <button @click.prevent="next()">Next</button>

    </div>

    <div v-if="step === 3">
      <h1>Step Three</h1>
      
      <div>
      <legend for="numtickets">Number of Tickets:</legend>
      <input id="numtickets" name="numtickets" type="number" v-model="registration.numtickets">
      </div>

      <div>
      <legend for="shirtsize">Shirt Size:</legend>
      <select id="shirtsize" name="shirtsize" v-model="registration.shirtsize">
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
        <option value="XL">X-Large</option>
      </select>
      </div>

      <button @click.prevent="prev()">Previous</button>
      <button @click.prevent="submit()">Save</button>
      
    </div>
    </form>

  <br/><br/>Debug: {{registration}}
</div>
</template>


<script>

import Vue from 'vue'

export default {
  name: 'Form',
   data() {
    return {
      step:1,
      registration:{
        name:null,
        email:null,
        street:null,
        city:null,
        state:null,
        numtickets:0,
        shirtsize:'XL'
      },
      name:null,
      email:null,
      street:null,
      city:null,
      state:null,
      numtickets:0,
      shirtsize:'XL'
    }
  },
  watch: {
    step: function () {
      this.$store.commit('setData', this.registration);
    }
  },
  methods:{
    prev() {
      this.step--;
    },
    next() {
      this.step++;
    },
    submit() {
      alert('Submit to blah and show blah and etc.');      
    }
  }
}

</script>
