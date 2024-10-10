<template>
  <div class="container">
    <div class="full-height-panel-container">
      <a-space style="margin-bottom: 20px">
        <a-button type="primary">新增探测节点</a-button>
        <a-input-search placeholder="输入节点名称/地址" style="width: 300px" />
        <a-button
          type="primary"
          status="danger"
          :disabled="selectedKeys.length === 0"
          >批量删除选中项</a-button
        >
        <a-button type="primary">刷新</a-button>
        <a-button type="primary">调整</a-button>
        <a-button type="primary">重启</a-button>
      </a-space>

      <a-space direction="vertical" size="large" fill>
        <a-table
          v-model:selectedKeys="selectedKeys"
          :columns="columns"
          :data="data"
          row-key="ip"
          pagination
        >
          <template #operation="{ record }">
            <a-space>
              <a-button type="link" @click="viewDetails(record)">详情</a-button>
            </a-space>
          </template>

          <template #cpu="{ record }">
            <a-progress :percent="record.cpu" />
          </template>

          <template #memory="{ record }">
            <a-progress :percent="record.memory" />
          </template>

          <template #disk="{ record }">
            <a-progress :percent="record.disk" />
          </template>
        </a-table>
      </a-space>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';

  export default {
    setup() {
      const columns = [
        { title: '探测节点IP', dataIndex: 'ip', key: 'ip' },
        { title: '探测节点名称', dataIndex: 'name', key: 'name' },
        { title: '所属地区', dataIndex: 'region', key: 'region' },
        { title: '探测节点类型', dataIndex: 'type', key: 'type' },
        { title: '状态', dataIndex: 'status', key: 'status' },
        { title: 'CPU', key: 'cpu', customRender: 'cpu' },
        { title: '内存', key: 'memory', customRender: 'memory' },
        { title: '磁盘', key: 'disk', customRender: 'disk' },
        { title: '任务', dataIndex: 'task', key: 'task' },
        { title: '操作', key: 'operation', customRender: 'operation' },
      ];

      const data = ref([
        {
          ip: '1.66.112.223',
          name: 'pktgen_engine_name111',
          region: '辽宁 移动',
          type: 'IP存活探测',
          status: '在线',
          cpu: 8,
          memory: 3,
          disk: 12,
          task: '未触发',
        },
        {
          ip: '1.83.124.115',
          name: 'hotvun_engine_name111',
          region: '吉林 联通',
          type: 'PoC探测',
          status: '在线',
          cpu: 88,
          memory: 9,
          disk: 22,
          task: '未触发',
        },
        {
          ip: '127.0.0.1',
          name: 'local',
          region: '本地机',
          type: '深度探测',
          status: '在线',
          cpu: 12,
          memory: 3,
          disk: 6,
          task: '未触发',
        },
      ]);

      const viewDetails = (record) => {
        console.log('View details for:', record);
        // Add modal or redirect logic here
      };

      return {
        selectedKeys: [],
        columns,
        data,
        viewDetails,
      };
    },
  };
</script>

<style scoped lang="less">
  .container {
    padding: 10px;
  }
  .full-height-panel-container {
    width: 100%;
    height: 100%;
    padding: 20px;
  }
</style>
