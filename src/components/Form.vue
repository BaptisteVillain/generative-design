<template>
  <div id="form">
    <div class="form-step">
      <div class="step-title">
        <span class="title-shadow"
          v-for="index in 6"
          :key="index"
          :style="{'transform': `translate(${index*5}px, -${index*5}px)`, 'z-index': index*-1}"
          >0{{step+1}}.</span>
        <span>
          0{{step+1}}.
        </span>
      </div>
      <div class="step-body">
          <p class="body-question">
            {{currentStep.question}}
          </p>
          <form-select
            v-for="(select, index) in currentStep.select"
            :key="index"
            :label="select.label"
            :active="currentStep.selected === index ? true : false"
            @click.native="onSelect(currentStep.slug, select.label, index)"
            />
      </div>

      <div class="step-footer">
        <button v-if="step > 0" @click.prevent="step--">Previous</button>
        <button v-if="step < form.length - 1" @click.prevent="step++">Next</button>
      </div>
    </div>
</div>
</template>


<script>

import Vue from 'vue'
import FormSelect from '@/components/FormSelect.vue';

export default {
  name: 'Form',
  components: {
    FormSelect
  },
  data() {
    return {
      step: 0,
      data: {},
      form: [
        {
          question: 'Are you either Dark Jaden Smith or Soft Jaden Smith ?',
          slug: 'background',
          selected: 0,
          select: [
            {
              label: 'Dark',
            },
            {
              label: 'Soft',
            }
          ]
        },
        {
          question: 'Are you either Dark Jaden Smith or Soft Jaden Smith ?',
          slug: 'background2',
          selected: 2,
          select: [
            {
              label: 'Dark',
            },
            {
              label: 'Soft',
            },
            {
              label: 'Soft',
            }
          ]
        },
        {
          question: 'Are you either Dark Jaden Smith or Soft Jaden Smith ?',
          slug: 'background3',
          selected: 1,
          select: [
            {
              label: 'Dark',
            },
            {
              label: 'Soft',
            },
            {
              label: 'Soft',
            }
          ]
        },
      ],
    }
  },
  computed: {
    currentStep: function () {
      const current = this.form[this.step];
      this.data[current.slug] = current.select[current.selected].label;

      this.$store.commit('setData', this.data);
      this.$store.commit('setUpdate');

      return current || null;
    }
  },
  watch: {
    step: function () {
      this.$store.commit('setData', this.data);
      this.$store.commit('setUpdate');
    },
    data: function () {
      this.$store.commit('setData', this.data);
      this.$store.commit('setUpdate');
    }
  },
  methods:{
    onSelect(key, value, index) {
      this.data[key] = value
      this.form[this.step].selected = index; 
      this.$store.commit('setData', this.data);
      this.$store.commit('setUpdate');
    }
  }
}

</script>

<style lang="scss">
  #form {
    padding-left: 150px;
    height: 700px;
    margin-top: 0;
    margin-bottom: auto;
    @media screen and (max-width: 760px){
      padding-left: 0;
      height: auto;
      padding: 70px 20px 50px 20px;
    }
    .form-step {
      min-width: 470px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .step-title {
        font-family: 'Druk Wide';
        font-weight: 900;
        font-size: 125px;
        position: relative;
        z-index: 10;
        line-height: 90px;
        span::selection {
          background: rgba(#ffffff, .98);
          color: #000000;
        }
        .title-shadow {
          position: absolute;
          top: 0;
          left: 0;
          color: $black;
          -webkit-text-stroke-width: 1px;
          -webkit-text-stroke-color: #ffffff;
          &::selection {
            background: rgba(#ffffff, .98);
            color: #000000;
          }
        }
      }

      .step-body {
        .body-question {
          font-size: 22px;
          font-weight: 300;
          opacity: 0.85;
          margin: 0;
          margin: 30px 0 25px 0;
          &::selection {
            background: rgba(#ffffff, .98);
            color: #000000;
          }
        }
      }

      .step-footer {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin-top: auto;
        button {
          -webkit-appearance: none;
          background: none;
          color: #ffffff;
          font-family: 'Druk Wide';
          font-weight: 900;
          font-size: 12px;
          text-transform: uppercase;
          border: none;
          padding: none;
          cursor: pointer;
          margin-right: 0px;
          margin-left: 30px;
          outline: none;
          &::selection {
            background: rgba(#ffffff, .98);
            color: #000000;
          }
        }
      }
    }
  }
</style>
