<template>
  <basic-container>
    <div class="layout-demo">
      <a-layout style="height: 1000px">
        <a-layout>
          <a-layout-sider theme="dark" style="width: 300px">
            <a-card :style="{ width: '100%' }" title="Arco Card">
              <template #extra>
                <a-link>More</a-link>
              </template>
              ByteDance's core product, Toutiao ("Headlines"), is a content
              platform in China and around the world. Toutiao started out as a
              news recommendation engine and gradually evolved into a platform
              delivering content in various formats.
            </a-card>
            <a-card :style="{ width: '100%' }" title="Arco Card">
              <template #extra>
                <a-link>More</a-link>
              </template>
              ByteDance's core product, Toutiao ("Headlines"), is a content
              platform in China and around the world. Toutiao started out as a
              news recommendation engine and gradually evolved into a platform
              delivering content in various formats.
            </a-card>
            <a-card :style="{ width: '100%' }" title="Arco Card">
              <template #extra>
                <a-link>More</a-link>
              </template>
              ByteDance's core product, Toutiao ("Headlines"), is a content
              platform in China and around the world. Toutiao started out as a
              news recommendation engine and gradually evolved into a platform
              delivering content in various formats.
            </a-card>
          </a-layout-sider>
          <a-layout-content style="margin-left: 20px">
            <a-card :style="{ width: '100%' }" title="Arco Card">
              <template #extra>
                <a-link>More</a-link>
              </template>
              ByteDance's core product, Toutiao ("Headlines"), is a content
              platform in China and around the world. Toutiao started out as a
              news recommendation engine and gradually evolved into a platform
              delivering content in various formats.
            </a-card>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
  </basic-container>
</template>

<script setup>
  import BasicContainer from '@/layout/basic-container.vue';
</script>

<style scoped>
  .layout-demo :deep(.arco-layout-header),
  .layout-demo :deep(.arco-layout-footer),
  .layout-demo :deep(.arco-layout-sider-children),
  .layout-demo :deep(.arco-layout-content) {
    display: flex;
    flex-direction: column;
  }

  .layout-demo :deep(.arco-layout-header),
  .layout-demo :deep(.arco-layout-footer) {
    height: 64px;
    background-color: #a74e4e;
  }

  .layout-demo :deep(.arco-layout-sider) {
    width: 506px;
    background-color: #564343;
  }

  .layout-demo :deep(.arco-layout-content) {
    background-color: #b2a5a5;
  }
</style>
