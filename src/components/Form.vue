<template>
  <div id="form">
    <div class="form-step">
      <div class="step-title">
        <span class="title-shadow"
          v-for="index in 8"
          :key="index"
          :style="{'transform': `translate(${index*5}px, -${index*5}px)`, 'z-index': index*-1}"
          >
          {{currentStep.title || `0${step}.`}}
          </span>
        <span>
          {{currentStep.title || `0${step}.`}}
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
          <FormTextarea
            v-if="step === form.length - 2"
            v-model="textareaText"
          />
          <button v-if="step === form.length - 1" ref="button" @click="downloadFile()" download="Jaden Smith and you.png" >Download</button>
      </div>

      <div class="step-footer">
        <button v-if="step > 0 && step < form.length - 1" @click.prevent="onPrevious(currentStep.slug)">Previous</button>
        <button v-if="step < form.length - 1" @click.prevent="step++">{{currentStep.nextContent || 'next'}}</button>
      </div>
    </div>
</div>
</template>


<script>

import Vue from 'vue'
import FormSelect from '@/components/FormSelect.vue';
import FormTextarea from '@/components/FormTextarea.vue';

export default {
  name: 'Form',
  components: {
    FormSelect,
    FormTextarea
  },
  data() {
    return {
      step: 0,
      textareaText: null,
      data: {},
      form: [
        {
          title: 'Start.',
          question: 'Activate your volume to fully enjoy the experience.',
          nextContent: 'Create your poster',
          select: [],
          selected: 0,
        },
        {
          question: 'Which side of Jaden do you prefer ?',
          slug: 'backgroundColor',
          selected: 0,
          select: [
            {
              label: 'Dark side',
            },
            {
              label: 'Soft side',
            }
          ]
        },
        {
          question: 'Which song from the album SYRE is your favorite ?',
          slug: 'backgroundFilter',
          selected: 0,
          select: [
            {
              label: 'Icon',
              url: require('@/assets/music/Jaden Smith - Icon.mp3'),
              playing: true,
            },
            {
              label: 'Batman',
              url: require('@/assets/music/Jaden Smith - Batman.mp3'),
              playing: false,
            },
            {
              label: 'Watch me',
              url: require('@/assets/music/Jaden Smith - Watch Me.mp3'),
              playing: false,
            },
            {
              label: 'Plastic',
              url: require('@/assets/music/Jaden Smith - Plastic.mp3'),
              playing: false,
            }
          ]
        },
        {
          question: 'Which lyrics have the most meaning for you ?',
          slug: 'lyrics',
          selected: 0,
          select: [
            {
              label: '“And girl I hope you know that no society or a cult \rCan take me away from you, you\'re the orange juice to my pulp”',
            },
            {
              label: '“Continental drift, and the next pole shift \rI ain\'t worried bout the science I\'m just glad we coexist”',
            },
            {
              label: '“All your verses sound like dirty dishes \rI\'m about to clean them in the kitchen”',
            },
            {
              label: '“My head is in peace, says look at the height that we reached \rWe\'re like some whales but we should tan on a beach”'
            }
          ]
        },
        {
          question: 'Which artist is a perfect match with Jaden ?',
          slug: 'cover',
          selected: 0,
          select: [
            {
              label: 'A$AP Rocky',
            },
            {
              label: 'Aminé',
            },
            {
              label: 'Kid Cudi',
            },
            {
              label: 'Tyler The Creator',
            },
            {
              label: 'Pharell',
            }
          ]
        },
        {
          question: 'Write a note to your future self.',
          slug:'quote',
          select: [],
          selected: 0,
          nextContent: 'End',
        },
        {
          title: 'End.',
          question: 'Download your unique poster by clicking the button below.',
          select: [],
          selected: 0,
        },
      ],
    }
  },
  computed: {
    currentStep: function () {
      const current = this.form[this.step];
      if (current.slug === 'quote'){
        this.data[current.slug] = this.textareaText;
      }
      else if(current.slug) {
        this.data[current.slug] = current.select[current.selected].label;
      }

      this.$store.commit('setData', this.data);
      this.$store.commit('setUpdate');

      return current || null;
    }
  },
  watch: {
    step: function () {
      this.$store.commit('setData', this.data);
      // this.$store.commit('setUpdate');
    },
    data: function () {
      this.$store.commit('setData', this.data);
      // this.$store.commit('setUpdate');
    }
  },
  methods:{
    onSelect(key, value, index) {
      this.data[key] = value
      this.form[this.step].selected = index; 
      this.$store.commit('setData', this.data);
      this.$store.commit('setUpdate');
    },
    onPrevious(stepSlug) {
      this.data[stepSlug] = null
      this.$store.commit('setData', this.data);
      // this.$store.commit('setUpdate');
      this.step--
    },
    downloadFile() {
      this.$store.commit('setDownload');
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
      width: 470px;
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
        white-space: nowrap;
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
          margin: 35px 0 50px 0;
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

        button{
          font-size: 12px;
          margin-left: 30px;
          margin-right: 0;
          border: none;
          font-family: 'Druk Wide';
          font-weight: 900;
        }
      }
    }

    button {
      -webkit-appearance: none;
      background: none;
      color: #ffffff;
      font-family: 'Aktiv Grotesk';
      font-weight: 400;
      font-size: 18px;
      text-transform: uppercase;
      padding: 15px 27px;
      cursor: pointer;
      outline: none;
      border: 2px solid #fff;

      &::selection {
        background: rgba(#ffffff, .98);
        color: #000000;
      }
        }
  }
</style>
