<template>
  <basic-container>
    <a-space>
      <a-button type="primary">重启</a-button>
      <a-button type="primary">暂停</a-button>
      <a-button type="primary">停止</a-button>
      <a-button type="primary">刷新</a-button>
      <a-button
        type="primary"
        status="danger"
        :disabled="selectedKeys.length === 0"
        >批量删除
      </a-button>
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="请输入任务名"
        button-text="搜索"
        search-button
        @search="searchTask"
      />
    </a-space>

    <p></p>

    <a-space direction="vertical" size="large" fill>
      <div>
        <span>OnlyCurrent: </span>
        <a-switch v-model="rowSelection.onlyCurrent" />
      </div>
      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="name"
        :columns="columns"
        :data="data"
        :row-selection="rowSelection"
        :pagination="pagination"
      />
    </a-space>
  </basic-container>
</template>

<script>
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import BasicContainer from '@/layout/basic-container.vue'; // 引入Ant Design Vue的消息组件

  export default {
    components: { BasicContainer },
    setup() {
      const selectedKeys = ref(['Jane Doe', 'Alisa Ross']);

      const rowSelection = reactive({
        type: 'checkbox',
        showCheckedAll: true,
        onlyCurrent: false,
      });

      const pagination = { pageSize: 5 };

      const columns = [
        { title: '任务名称', dataIndex: 'name' },
        { title: '任务类型', dataIndex: 'type' },
        { title: '起止时间', dataIndex: 'time' },
        { title: '探测目标', dataIndex: 'target' },
        { title: '端口', dataIndex: 'ports' },
        { title: '扫描次数', dataIndex: 'scanCount' },
        {
          title: '进度',
          dataIndex: 'progress',
        },
        {
          title: '扫描结果个数',
          dataIndex: 'progress',
        },
        {
          title: '任务详情',
          key: 'action',
        },
        {
          title: '操作',
          key: 'action',
        },
      ];

      const data = reactive([
        {
          id: 1,
          name: '任务1',
          type: '探测任务',
          time: '2024-10-01 12:00 - 2024-10-01 14:00',
          range: '192.168.0.1-192.168.0.100',
          ports: 'TCP:80,443',
          scanCount: 1,
          progress: 75,
          status: 'running', // running（进行中）、paused（已暂停）、stopped（已停止）
        },
        {
          id: 2,
          name: '任务2',
          type: '探测任务',
          time: '2024-10-01 12:00 - 2024-10-01 14:00',
          range: '192.168.1.1-192.168.1.100',
          ports: 'TCP:22',
          scanCount: 2,
          progress: 50,
          status: 'paused',
        },
      ]);

      // 根据任务状态返回不同的进度条颜色
      function getProgressColor(status) {
        if (status === 'paused') return '#FADB14'; // 黄色：暂停
        if (status === 'stopped') return '#FF4D4F'; // 红色：停止
        return '#52C41A'; // 绿色：进行中
      }

      // 返回Ant Design的进度条状态
      function getProgressStatus(status) {
        if (status === 'paused') return 'active'; // 可选 'exception', 'active', 'normal'
        if (status === 'stopped') return 'exception';
        return 'normal';
      }

      // 任务操作
      function pauseTask(task) {
        task.status = 'paused';
        message.success('任务已暂停');
      }

      function continueTask(task) {
        task.status = 'running';
        message.success('任务已继续');
      }

      function stopTask(task) {
        task.status = 'stopped';
        message.success('任务已停止');
      }

      function restartTask(task) {
        task.scanCount += 1;
        task.status = 'running';
        message.success('任务已重启');
      }

      function deleteTask(task) {
        data.value = data.value.filter((t) => t.id !== task.id);
        message.success('任务已删除');
      }
      return {
        rowSelection,
        columns,
        data,
        selectedKeys,
        pagination,
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
