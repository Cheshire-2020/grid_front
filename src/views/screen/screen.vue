<script setup lang="ts"></script>

<template>
  <dv-full-screen-container>
    <div class="module-box">
      <div style="flex: 0 1 50%">
        <dv-border-box1 style="width: 100%; height: 200px">
          dv-border-box1
        </dv-border-box1>
      </div>
      <div style="flex: 0 1 50%">
        <dv-border-box1 style="width: 100%; height: 200px">
          dv-border-box1
        </dv-border-box1>
      </div>
    </div>
  </dv-full-screen-container>
</template>

<style scoped>
  .module-box {
    display: flex;
    justify-content: space-between;
    margin: 5px;
  }
</style>
