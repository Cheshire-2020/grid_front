<script setup lang="ts">
  /*  eslint-disable */
  import axios from 'axios';
  import { onMounted, ref } from 'vue';
  const result = ref({});
  onMounted(() => {
    axios.get('http://localhost:8080/api/SysPortGroup/demo').then((res) => {
      result.value = res.data;
    });
  });
</script>

<template>
  <div class="container">
    <div class="full-height-panel-container">
      {{ result }}
      <div v-for="i in 100" :key="i">
        <h1>{{ i }}</h1>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
