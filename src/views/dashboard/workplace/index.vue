<template>
  <div class="container">
    <div class="left-side">
      <div class="panel" style="margin-bottom: 16px; height: 400px">
        <a-card
          :bordered="false"
          class="general-card"
          :header-style="{ paddingBottom: '0' }"
          :body-style="{ padding: '20px' }"
        >
          <a-result status="404" subtitle="关键字搜索">
            <template #extra>
              <a-grid
                :cols="24"
                :col-gap="16"
                :row-gap="16"
                style="margin-top: 16px"
              >
                <a-grid-item :span="12" :offset="6">
                  <a-input-search
                    placeholder="请输入查询的内容"
                    size="large"
                    allow-clear
                    search-button
                  >
                    <template #button-icon>
                      <icon-search />
                    </template>
                    <template #button-default> 搜索</template>
                  </a-input-search>
                </a-grid-item>
              </a-grid>
            </template>
          </a-result>
        </a-card>
      </div>
      <div class="panel">
        <Banner />
        <DataPanel />
        <ContentChart />
      </div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
        >
          <PopularContent />
        </a-grid-item>
        <a-grid-item
          :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }"
        >
          <CategoriesPercent />
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Banner from './components/banner.vue';
  import DataPanel from './components/data-panel.vue';
  import ContentChart from './components/content-chart.vue';
  import PopularContent from './components/popular-content.vue';
  import CategoriesPercent from './components/categories-percent.vue';
</script>

<script lang="ts">
  export default {
    name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped></style>
