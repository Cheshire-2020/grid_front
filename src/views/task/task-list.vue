<template>
  <basic-container>
    <a-space>
      <a-button type="primary" @click="restartTask">重启</a-button>
      <a-button type="primary" @click="pauseTask">暂停</a-button>
      <a-button type="primary" @click="continueTask">继续检测</a-button>
      <a-button type="primary" @click="stopTask">停止</a-button>
      <a-button type="primary" @click="refreshData">刷新</a-button>
      <a-button
        type="primary"
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="bulkDelete"
        >批量删除
      </a-button>
      <a-input-search
        v-model:value="searchKeyword"
        :style="{ width: '320px' }"
        placeholder="请输入任务名"
        button-text="搜索"
        search-button
        @search="searchTask"
      />
    </a-space>

    <p></p>

    <a-space direction="vertical" size="large" fill>
      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="name"
        :columns="columns"
        :data="filteredData"
        :row-selection="rowSelection"
        :pagination="pagination"
      >
        <template #time="{ record }">
          <span>开始时间：{{ record.timeStart }}</span>
          <br>
          <span>结束时间：{{ record.timeEnd }}</span>
        </template>
        <template #process="{ record }">
          <div style="display: flex; flex-direction: column; align-items: flex-start;">
            <div style="display: flex; align-items: center;">
              <span style="width: 100px;">存活探测</span>
              <a-progress :percent="record.percent1"
                          :stroke-color="getStrokeColor(record)"
                          :status="getProgressStatus(record)" />
            </div>
            <div style="display: flex; align-items: center;">
              <span style="width: 100px;">指纹探测</span>
              <a-progress :percent="record.percent2"
                          :stroke-color="getStrokeColor(record)"
                          :status="getProgressStatus(record)" />
            </div>
            <div style="display: flex; align-items: center;">
              <span style="width: 100px;">拓扑探测</span>
              <a-progress :percent="record.percent3"
                          :stroke-color="getStrokeColor(record)"
                          :status="getProgressStatus(record)" />
            </div>
          </div>
        </template>
      </a-table>
    </a-space>
  </basic-container>
</template>

<script>
  import { ref, reactive, onMounted, computed, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import BasicContainer from '@/layout/basic-container.vue';
  // 引入Ant Design Vue的消息组件

  export default {

    components: { BasicContainer },
    setup() {
      const selectedKeys = ref([]);
      const searchKeyword = ref(''); // 搜索关键词

      const rowSelection = reactive({
        type: 'checkbox',
        showCheckedAll: true,
      });

      const pagination = { pageSize: 5 };

      const columns = [
        { title: '任务名称', dataIndex: 'name' },
        { title: '任务类型', dataIndex: 'type' },
        { title: '起止时间', slotName: 'time' },
        { title: '探测目标', dataIndex: 'target' },
        { title: '端口', dataIndex: 'ports' },
        { title: '扫描次数', dataIndex: 'scanCount' },
        { title: '扫描结果个数', dataIndex: 'resultCount' },
        { title: '进度', slotName: 'process' },
        { title: '任务详情', key: 'action' },
      ];

      const data = ref([
        {
          id: 1,
          name: '任务1',
          type: '探测任务',
          timeStart: '2024-10-01 12:00',
          timeEnd:'2024-10-01 14:00',
          target: '192.168.0.1-192.168.0.100',
          ports: 'TCP:80,443',
          scanCount: 1,
          percent1: 0.3, // 存活探测进度
          percent2: 0.6, // 指纹探测进度
          percent3: 0.9, // 拓扑探测进度
          resultCount: 10,
          status: 'running', // running（进行中）、paused（已暂停）、stopped（已停止）
        },
        {
          id: 2,
          name: '任务2',
          type: '探测任务',
          timeStart: '2024-10-01 12:00',
          timeEnd: '2024-10-01 14:00',
          target: '192.168.1.1-192.168.1.100',
          ports: 'TCP:22',
          scanCount: 2,
          percent1: 0.4, // 存活探测进度
          percent2: 0.7, // 指纹探测进度
          percent3: 0.8, // 拓扑探测进度
          resultCount: 5,
          status: 'paused',
        },
        {
          id: 3,
          name: '任务3',
          type: '探测任务',
          timeStart: '2024-10-01 12:00',
          timeEnd: '2024-10-01 14:00',
          target: '192.168.1.1-192.168.1.100',
          ports: 'TCP:22',
          scanCount: 2,
          percent1: 0.4, // 存活探测进度
          percent2: 0.7, // 指纹探测进度
          percent3: 0.8, // 拓扑探测进度
          resultCount: 5,
          status: 'paused',
        },
      ]);

      // eslint-disable-next-line no-shadow
      const getStrokeColor = (task) => {
        switch (task.status) {
          case 'paused':
            return '#FADB14'; // 黄色
          case 'stopped':
            return '#FF4D4F'; // 红色
          case 'finished':
            return '#52C41A'; // 绿色
          default:
            return '#1890FF'; // 蓝色
        }
      };

      // 返回进度条的状态 const  function
      const getProgressStatus = (task) => {
        if (task.status === 'paused') return 'active'; // Ant Design的状态
        if (task.status === 'stopped') return 'exception';
        if (task.status === 'finished') return 'success';
        return 'normal';
      };

      // 过滤后的数据:filteredData：这是表格中显示的任务数据，用户搜索时会对其进行过滤。它基于data动态更新。
      const filteredData = ref([...data.value]);

      // searchTask函数：根据输入的关键词，过滤任务数据，过滤规则是任务名称中包含搜索关键词（不区分大小写）
      function searchTask(value) {
        const keyword = value.trim().toLowerCase();  // 去除空格并转换为小写
        if (keyword === '') {
          // 如果关键词为空，显示所有数据
          filteredData.value = [...data.value];
        } else {
          // 根据关键词进行过滤
          filteredData.value = data.value.filter((task) =>
              task.name.toLowerCase().includes(keyword)
          );
        }
      }

      // 动态增加进度条百分比
      function updateProgress(task) {
        if (task.status === 'running') {
          // 逐个进度条检查并更新，确保每次增加0.01，并且防止浮点数精度问题
          if (task.percent1 < 1) {
            task.percent1 = Math.min((task.percent1 * 100 + 1) / 100, 1); // 确保增加0.01
          }
          if (task.percent2 < 1) {
            task.percent2 = Math.min((task.percent2 * 100 + 1) / 100, 1); // 确保增加0.01
          }
          if (task.percent3 < 1) {
            task.percent3 = Math.min((task.percent3 * 100 + 1) / 100, 1); // 确保增加0.01
          }

          if (task.percent1 === 1 && task.percent2 === 1 && task.percent3 === 1) {
            task.status = 'finished';
            message.success(`${task.name} 已完成`);
          }
        }
      }

      // 每秒更新一次进度
      let intervalId;
      onMounted(() => {
        intervalId = setInterval(() => {
          data.value.forEach(updateProgress);
        }, 1000);
      });

      // 任务控制
      function pauseTask() {
        selectedKeys.value.forEach((key) => {
          const task = data.value.find((t) => t.name === key);
          if (task.status === 'running') {
            task.status = 'paused';
          }
        });
      }

      function continueTask() {
        selectedKeys.value.forEach((key) => {
          const task = data.value.find((t) => t.name === key);
          if (task.status === 'paused') {
            task.status = 'running';
          }
        });
      }

      function stopTask() {
        selectedKeys.value.forEach((key) => {
          const task = data.value.find((t) => t.name === key);
          task.status = 'stopped';
        });
      }

      function restartTask() {
        selectedKeys.value.forEach((key) => {
          const task = data.value.find((t) => t.name === key);
          task.percent1 = 0;
          task.percent2 = 0;
          task.percent3 = 0;
          task.status = 'running';
        });
      }

      function bulkDelete() {
        data.value = data.value.filter((task) => !selectedKeys.value.includes(task.name));
        message.success('选中的任务已删除');
      }

      // 设置进度条颜色
      function getProgressColor(status) {
        console.log(status)
        switch (status) {
          case 'paused':
            return '#FADB14'; // 黄色
          case 'stopped':
            return '#FF4D4F'; // 红色
          case 'finished':
            return '#52C41A'; // 绿色
          default:
            return '#1890FF'; // 蓝色
        }
      }

      // 模拟刷新数据
      function refreshData() {
        message.loading('正在刷新数据...', 0);

        setTimeout(() => {
          // 模拟刷新后从后端获取新数据
          data.value = [
            {
              id: 1,
              name: '任务1',
              type: '探测任务',
              timeStart: '2024-10-01 12:00',
              timeEnd: '2024-10-01 14:00',
              target: '192.168.0.1-192.168.0.100',
              ports: 'TCP:80,443',
              scanCount: 2, // 更新扫描次数
              percent1: 0.5,
              percent2: 0.8,
              percent3: 0.9,
              resultCount: 15,
              status: 'running',
            },
            {
              id: 2,
              name: '任务2',
              type: '探测任务',
              timeStart: '2024-10-01 12:00',
              timeEnd: '2024-10-01 14:00',
              target: '192.168.1.1-192.168.1.100',
              ports: 'TCP:22',
              scanCount: 3, // 更新扫描次数
              percent1: 0.6,
              percent2: 0.9,
              percent3: 1.0,
              resultCount: 7,
              status: 'paused', // 更新状态
            },
            {
              id: 4,
              name: '任务4',
              type: '探测任务',
              timeStart: '2024-10-02 09:00',
              timeEnd: '2024-10-02 11:00',
              target: '192.168.2.1-192.168.2.50',
              ports: 'TCP:23',
              scanCount: 1,
              percent1: 0.2,
              percent2: 0.4,
              percent3: 0.5,
              resultCount: 3,
              status: 'running',
            },
          ];
          filteredData.value = [...data.value]; // 刷新后同步更新过滤后的数据,确保数据刷新后搜索仍然有效。
          message.destroy(); // 停止 loading 信息
          message.success('数据已刷新');
        }, 2000); // 模拟 2 秒的加载时间
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
        pauseTask,
        continueTask,
        stopTask,
        restartTask,
        bulkDelete,
        getProgressColor,
        getStrokeColor,
        getProgressStatus,
        refreshData,
        searchKeyword,
        searchTask,
        filteredData,
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
