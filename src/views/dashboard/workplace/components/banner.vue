<template>
  <a-col class="banner">
    <a-col :span="8">
      <a-typography-title :heading="6" style="margin-top: 0">
        系统资源一览表
      </a-typography-title>
    </a-col>
  </a-col>
</template>

<script lang="ts" setup></script>

<style scoped lang="less">
  .banner {
    width: 100%;
    padding: 20px 20px 0 20px;
    border-radius: 4px 4px 0 0;
  }

  :deep(.arco-icon-home) {
    margin-right: 6px;
  }
</style>
