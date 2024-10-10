<script setup lang="ts">
  import BasicContainer from '@/layout/basic-container.vue';
</script>

<template>
  <basic-container>
    <div v-for="i in 100" :key="i">
      <h1>{{ i }}</h1>
    </div>
  </basic-container>
</template>

<style scoped lang="less"></style>
