<template>
  <div class="form-textarea">
    <input v-model="textareaContent" class="textarea" :placeholder="textareaInit" />
    <div class="textarea-border-top"></div>
    <div class="textarea-border-bottom"></div>
  </div>
</template>

<script>
export default {
  name: 'FormTextarea',
  props: ['content'],
  data(){
    return{
      textareaInit: 'Be a YES Man',
      textareaContent: ''
    }
  },
  watch:{
    textareaContent(value){
      this.$emit('input', value)
    }
  }
}
</script>

<style>
.form-textarea{
  position: relative;
}

.textarea{
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.15);
  width: 100%;
  height: auto;
  padding: 15px;
  resize: none;
  /* line-height: 45px; */
  transition: border 0.2s ease-in;
}

.textarea:focus{
  outline: none;
  border: 2px solid rgba(255, 255, 255, 0.35);
}

.textarea-border-top{
  position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border-top: 2px solid #fff;
    border-left: 2px solid #fff;
}
.textarea-border-bottom{
  position: absolute;
    bottom: 0px;
    right: 0;
    width: 24px;
    height: 24px;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
}
</style>


