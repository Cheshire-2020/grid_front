<template>
  <basic-container>
    <a-space>
      <a-button type="primary" @click="startTask">开始</a-button>
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
        row-key="id"
        :columns="columns"
        :data="filteredData"
        :row-selection="rowSelection"
        :pagination="pagination"
      >
        <template #time="{ record }">
          <span>开始时间：{{ record.timeStart }}</span>
          <br />
          <span>结束时间：{{ record.timeEnd }}</span>
        </template>
        <template #process="{ record }">
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            "
          >
            <div style="display: flex; align-items: center">
              <span style="width: 100px">存活探测</span>
              <a-progress
                :percent="record.percent1"
                :stroke-color="getStrokeColor(record)"
                :status="getProgressStatus(record)"
              />
            </div>
            <div style="display: flex; align-items: center">
              <span style="width: 100px">指纹探测</span>
              <a-progress
                :percent="record.percent2"
                :stroke-color="getStrokeColor(record)"
                :status="getProgressStatus(record)"
              />
            </div>
            <div style="display: flex; align-items: center">
              <span style="width: 100px">拓扑探测</span>
              <a-progress
                :percent="record.percent3"
                :stroke-color="getStrokeColor(record)"
                :status="getProgressStatus(record)"
              />
            </div>
          </div>
        </template>
      </a-table>
    </a-space>
  </basic-container>
</template>

<script>
  import { ref, reactive, onMounted, onUnmounted } from 'vue';
  import { message as antdMessage } from 'ant-design-vue';
  import BasicContainer from '@/layout/basic-container.vue';
  import axios from 'axios';

  export default {
    components: { BasicContainer },
    setup() {
      const selectedKeys = ref([]);
      const searchKeyword = ref(''); // 搜索关键词
      let socket;
      const rowSelection = reactive({
        type: 'checkbox',
        showCheckedAll: true,
      });

      const pagination = { pageSize: 5 };

      const columns = [
        { title: '任务id', dataIndex: 'id' },
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

      const data = ref([]);
      const filteredData = ref([]);

      // 加载任务数据
      const loadTaskData = async () => {
        try {
          antdMessage.loading('加载数据中...', 0);
          const response = await axios.get(
            'http://172.18.17.113:8888/taskManage/getAlltask'
          );
          console.log(response);

          if (response.data.code === '200') {
            data.value = response.data.data.map((task) => {
              if (task.typeOfTask === 1) {
                return {
                  id: task.taskID,
                  type: '节点探测',
                  name: task.name,
                  priority: task.priority,
                  target: task.targets.join(', '),
                  ports: `TCP: ${task.tcpPorts.join(', ')}; UDP: ${task.udpPorts.join(', ')}`,
                  scanCount: 1,
                  resultCount: 0,
                };
              }
              return {
                id: task.taskID,
                name: task.name,
                type: 'POC/插件任务',
                scanCount: 1,
                resultCount: 0,
                target: task.usingNodeGroup,
                ports: '无',
              };
            });

            filteredData.value = [...data.value];
            antdMessage.destroy();
            antdMessage.success('数据加载成功');
          } else {
            antdMessage.destroy();
            antdMessage.error('数据加载失败');
          }
        } catch (error) {
          antdMessage.destroy();
          antdMessage.error('数据加载失败');
          console.error('Error loading tasks:', error);
        }
      };

      // 组件挂载时加载数据
      onMounted(() => {
        loadTaskData();
      });

      // 组件卸载时关闭 WebSocket 连接
      onUnmounted(() => {
        if (socket) {
          socket.close();
        }
      });

      // 任务控制函数
      function startTask() {
        const selectedId = selectedKeys.value.length > 0 ? selectedKeys.value[0] : null;

        if (selectedId) {
          const task = data.value.find((t) => t.id === selectedId);
          if (task) {
            // 初始化 WebSocket 监听任务进度
            socket = new WebSocket('ws://172.18.17.113:8888/task-websocket');

            socket.onopen = () => {
              console.log('WebSocket 已连接');
              // 发送选中的任务 ID
              socket.send(
                JSON.stringify({


                  
                  taskId: task.id,
                })
              );

              // 发送API请求
              const url =
                task.type === '节点探测'
                  ? `http://172.18.17.113:8888/taskManage/startNodeTask?taskID=${task.id}`
                  : `http://172.18.17.113:8888/taskManage/startPocTask?taskID=${task.id}`;

              axios
                .get(url)
                .then((response) => {
                  if (response.status === 200) {
                    task.status = 'running';
                    task.percent1 = 0;
                    task.percent2 = 0;
                    task.percent3 = 0;
                    antdMessage.success('任务已成功开始');
                  } else {
                    antdMessage.error('任务开始失败');
                  }
                })
                .catch((error) => {
                  console.error('Error starting task:', error);
                  antdMessage.error('任务开始时发生错误');
                });
            };

            socket.onmessage = (event) => {
              const wsMessage = JSON.parse(event.data);
              console.log('收到 WebSocket 消息：', wsMessage);
               console.log(wsMessage.taskID);
               console.log(task.id);
              // 根据收到的任务 ID 更新任务的进度
              if (task.id === wsMessage.taskID) {
                console.log(task.rate);
                task.percent1 = (wsMessage.rate)/100;
                task.percent2 = (wsMessage.rate)/100;
                task.percent3 = (wsMessage.rate)/100;
              }
            };

            socket.onerror = (error) => {
              console.error('WebSocket 错误: ', error);
            };

            socket.onclose = () => {
              console.log('WebSocket 已断开');
            };
          }
        } else {
          antdMessage.warning('未选中任何任务');
        }
      }

      function pauseTask() {
        selectedKeys.value.forEach((key) => {
          const task = data.value.find((t) => t.id === key);
          if (task && task.status === 'running') {
            task.status = 'paused';
          }
        });
      }

      function continueTask() {
        selectedKeys.value.forEach((key) => {
          const task = data.value.find((t) => t.id === key);
          if (task && task.status === 'paused') {
            task.status = 'running';
          }
        });
      }

      function stopTask() {
        selectedKeys.value.forEach((key) => {
          const task = data.value.find((t) => t.id === key);
          if (task) {
            task.status = 'stopped';
          }
        });
      }

      function bulkDelete() {
        data.value = data.value.filter((task) => !selectedKeys.value.includes(task.id));
        filteredData.value = [...data.value];
        antdMessage.success('选中的任务已删除');
      }

      function refreshData() {
        antdMessage.loading('正在刷新数据...', 0);
        loadTaskData();
      }

      function searchTask(value) {
        const keyword = value.trim().toLowerCase();
        if (keyword === '') {
          filteredData.value = [...data.value];
        } else {
          filteredData.value = data.value.filter((task) =>
            task.name.toLowerCase().includes(keyword)
          );
        }
      }

      const getStrokeColor = (task) => {
        switch (task.status) {
          case 'paused':
            return '#FADB14';
          case 'stopped':
            return '#FF4D4F';
          case 'finished':
            return '#52C41A';
          default:
            return '#1890FF';
        }
      };

      const getProgressStatus = (task) => {
        if (task.status === 'paused') return 'active';
        if (task.status === 'stopped') return 'exception';
        if (task.status === 'finished') return 'success';
        return 'normal';
      };

      return {
        rowSelection,
        columns,
        data,
        filteredData,
        selectedKeys,
        pagination,
        startTask,
        pauseTask,
        continueTask,
        stopTask,
        bulkDelete,
        refreshData,
        searchTask,
        getStrokeColor,
        getProgressStatus,
        searchKeyword,
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
