<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="full-height-panel-container">
      <!-- Action Buttons -->
      <a-card
        :bordered="false"
        class="general-card"
        :header-style="{ paddingBottom: '0' }"
        :body-style="{ padding: '20px' }"
      >
        <slot></slot>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
