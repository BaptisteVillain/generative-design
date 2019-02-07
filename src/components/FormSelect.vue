<template>
  <div class="form-select" :class="{'active' : active}">
    <div class="radio">
      <div class="radio-active"></div>
    </div>
    <div class="label">
      {{label}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormSelect',
  props: {
    label: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
  .form-select {
    display: flex;
    flex-direction: row;
    margin-top: 25px;
    &.active {
      .radio {
        border-color: #ffffff;
      }
      .radio-active {
        transform: scale(1);
      }
      .label {
        color: #ffffff;
      }
    }
    .radio {
      width: 30px;
      height: 30px;
      border: 2px solid rgba(#ffffff, .8);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .radio-active {
      width: 20px;
      height: 20px;
      background: #ffffff;
      border-radius: 50%;
      transform: scale(0);
    }
    .label {
      margin-left: 22px;
      font-size: 18px;
      font-weight: 300;
      line-height: 30px;
      color: rgba(#ffffff, .8);
      cursor: pointer;
      &::selection {
        background: rgba(#ffffff, .98);
        color: #000000;
      }
    }
  }
</style>
