<template>
  <a-page-header title="新建任务" />
  <a-form :model="formData" class="task-form" @submit="onSubmit">
    <!-- 任务名称 -->
    <a-form-item field="taskName" label="任务名称">
      <a-textarea
        v-model="formData.taskName"
        :auto-size="{ minRows: 1, maxRows: 1 }"
        :placeholder="taskNamePlaceholder"
      />
    </a-form-item>

    <!-- 任务类型 -->
    <a-form-item field="taskType" label="任务类型">
      <a-radio-group v-model="formData.taskType" @change="handleTaskTypeChange">
        <a-radio value="1">结点探测</a-radio>
        <a-radio value="2">POC/插件任务</a-radio>
      </a-radio-group>
    </a-form-item>

    <!-- 节点探测表单 -->
    <div v-if="Number(formData.taskType) === 1">
      <!-- 扫描类型 -->
      <a-form-item field="scanType" label="扫描类型">
        <a-radio-group
          v-model="formData.scanType"
          @change="handleScanTypeChange"
        >
          <a-radio value="1">ipv4</a-radio>
          <a-radio value="2">ipv6</a-radio>
          <a-radio value="3">结点组</a-radio>
          <a-radio value="4">域名</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 扫描目标 -->
      <a-form-item field="targets" label="扫描目标">
        <a-textarea
          v-model="formData.targets"
          :auto-size="{ minRows: 3, maxRows: 10 }"
          :placeholder="targetsPlaceholder"
        />
      </a-form-item>

      <!-- 自定义选项 -->
      <a-form-item>
        <a-space>
          <a-checkbox v-model="formData.saveAsNodeGroup">存为结点组</a-checkbox>
        </a-space>
      </a-form-item>

      <!-- 本地导入 -->
      <a-form-item label="本地导入">
        <a-upload
          :file-list="fileList"
          :show-upload-list="true"
          :before-upload="beforeUpload"
          @remove="onRemoveFile"
        >
          <a-button icon="upload">点击导入</a-button>
        </a-upload>
      </a-form-item>

      <!-- 取消导入按钮 -->
      <a-form-item>
        <a-button @click="clearFileList">取消导入</a-button>
      </a-form-item>

      <!-- 主机存活探测 -->
      <a-form-item field="hostDetection" label="主机存活探测">
        <a-checkbox v-model="formData.hostDetection">主机存活探测</a-checkbox>
      </a-form-item>

      <!-- TCP端口 -->
      <a-form-item field="tcpPorts" label="TCP端口">
        <a-textarea
          v-model="formData.tcpPorts"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :placeholder="portsPlaceholder"
        />
      </a-form-item>

      <!-- UDP端口 -->
      <a-form-item field="udpPorts" label="UDP端口">
        <a-textarea
          v-model="formData.udpPorts"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :placeholder="portsPlaceholder"
        />
      </a-form-item>
    </div>

    <!-- PoC结点探测表单 -->
    <div v-if="Number(formData.taskType) === 2">
      <a-form-item label="目标检测">
        <a-checkbox v-model="formData.targetCheck">目标检测</a-checkbox>
      </a-form-item>

      <!-- PoC规则选择 -->
      <a-form-item label="PoC规则">
        <a-transfer
          :data="pocOptions"
          :titles="['可选规则', '已选规则']"
          filterable
          v-model:selected-keys="formData.selectedPocs"
        />
      </a-form-item>

      <!-- PoC探测节点分配 -->
      <a-form-item label="PoC探测节点分配">
        <a-radio-group v-model="formData.pocTargetNode" @change="handlePocTargetNodeChange">
          <a-radio value="随机分配">随机分配</a-radio>
          <a-radio value="手动分配">手动分配</a-radio>
        </a-radio-group>
      </a-form-item>
   
      <!-- 手动选择节点复选框 -->
      <div v-if="formData.pocTargetNode === '手动分配'">
    <a-form-item label="选择结点">
        <a-radio-group v-model="formData.selectedNode"> 
            <a-radio v-for="node in availableNodes" :key="node" :value="node">{{ node }}</a-radio>
        </a-radio-group>
    </a-form-item>
</div>


    </div>
    <!-- 高级配置选项 -->
    <a-form-item>
      <a-button @click="advancedConfiguration">高级配置</a-button>
    </a-form-item>

    <!-- 高级配置弹窗 -->
    <a-modal
      v-model:visible="isModalVisible"
      title="高级配置"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-item label="周期执行">
        <a-input-number v-model="formData.cycleExecutionNumber" :min="1" />
      </a-form-item>
      <!-- 周期执行 -->
      <a-form-item label="周期执行单位">
        <a-radio-group v-model="formData.cycleExecution">
          <a-radio value="天">天</a-radio>
          <a-radio value="时">时</a-radio>
          <a-radio value="分钟">分钟</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 执行方式 -->
      <a-form-item label="执行方式">
        <a-radio-group v-model="formData.executionType">
          <a-radio value=false>立即执行</a-radio>
          <a-radio value=true>延迟执行</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 优先级 -->
      <a-form-item label="优先级">
        <a-radio-group v-model="formData.priority">
          <a-radio value="1">低</a-radio>
          <a-radio value="2">中</a-radio>
          <a-radio value="3">高</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 探测速度 -->
      <a-form-item label="探测速度">
        <a-radio-group v-model="formData.detectionSpeed">
          <a-radio value="快速探测">快速探测</a-radio>
          <a-radio value="慢速探测">慢速探测</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 等待时间 -->
      <a-form-item label="等待时间">
        <a-input-number v-model="formData.waitTime" :min="1" :max="30" />
      </a-form-item>

      <!-- 间隔时间 -->
      <a-form-item label="间隔时间">
        <a-input-number v-model="formData.intervalTime" :min="100" :max="1000" />
      </a-form-item>

      <!-- 重试次数 -->
      <a-form-item label="重试次数">
        <a-input-number v-model="formData.retryTimes" :min="1" :max="10" />
      </a-form-item>

      <!-- 保存排查活跃数据 -->
      <a-form-item>
        <a-checkbox v-model="formData.saveActiveData">保存非存活数据</a-checkbox>
      </a-form-item>

      <!-- 例外IP -->
      <a-form-item label="例外IP">
        <a-radio-group v-model="formData.exceptionIPType">
          <a-radio value="手动输入">手动输入</a-radio>
          <a-radio value="选择已有ip">选择已有ip</a-radio>
        </a-radio-group>
      </a-form-item>

      <div v-if="formData.exceptionIPType === '手动输入'">
        <a-form-item label="手动输入">
          <a-textarea
            v-model="formData.exceptionIP"
            :auto-size="{ minRows: 2, maxRows: 4 }"
          />
        </a-form-item>
      </div>
      <a-form-item>
        <a-checkbox v-model="formData.saveAsExceptionGroup">保存为例外ip组</a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model="formData.addPrivate">是否勾选私网地址添加到额外ip中</a-checkbox>
      </a-form-item>
    </a-modal>
    <!-- 提交/取消按钮 -->
    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit">创建任务</a-button>
        <a-button @click="resetForm">取消</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import axios from 'axios';

  export default defineComponent({
    name: 'TaskForm',
    setup() {
      const availableNodes = ref([]);
      const formData = reactive({
        taskName: '',
        taskType: "1",
        pocTaskName: '',
        selectedPocs: [],
        pocTargetNode: '',
        scanType: 1,
        targets: '',
        saveAsNodeGroup: false,
        tcpPorts: '',
        udpPorts: '',
        hostDetection: false,
        targetCheck: false,
        cycleExecutionNumber: 1,
        cycleExecution: '',
        executionType: false,
        exceptionIPType: '手动输入',
        exceptionIP: '',
        priority: '1',
        detectionSpeed: '快速探测',
        waitTime: 5,
        intervalTime: 500,
        retryTimes: 3,
        saveActiveData: false,
        saveAsExceptionGroup: false,
        addPrivate: false,
        selectedNode:'',
      });
      const fileList = ref([]);

      const pocOptions = ref([
        { value: '1', label: 'GitLab Graphql API任意用户查询漏洞' },
        { value: '2', label: '锐捷RG-UAC统一网关漏洞' },
        { value: '3', label: 'Exchange服务器远程命令执行漏洞' },
        { value: '4', label: '多个业务安全网关命令执行漏洞' },
      ]);

      const taskNamePlaceholder = computed(
        () => '任务名称长度必须在7-20之间，且不能包含括号中的字符(<>"/\'&$<>);'
      );

      const targetsPlaceholder = computed(
        () =>
          '支持输入IP、IP段、多个域名或节点名称，每行一个。最多支持10000个扫描目标。'
      );

      const portsPlaceholder = computed(
        () =>
          '支持填写单个端口和端口范围，例:80-65535，端口组成的字符长度范围为0-382105。'
      );

      const handleTaskTypeChange = (value: number) => {
        console.log('任务类型切换为:', value);
        formData.taskType = value;
      };
      const handleScanTypeChange = (value: number) => {
        console.log('扫描类型切换为:', value);
        formData.scanType = value;
      };
      const onSubmit = async () => {
        try {
          const portRegex = /^(\d+(-\d+)?)(\s*,\s*(\d+(-\d+)?))*$/;

          const isValidPortNumber = (port: number): boolean => {
            return Number.isInteger(port) && port >= 0 && port <= 65535;
          };

          const validatePorts = (ports: string, portType: string) => {
            if (ports && !portRegex.test(ports)) {
              throw new Error(`${portType} port input format is incorrect. Please enter numbers or number ranges, separated by commas.`);
            }

            const portList = ports.split(/[,\s]+/).filter(port => port !== '');

            portList.forEach(port => {
              if (port.includes('-')) {
                const [start, end] = port.split('-').map(p => parseInt(p, 10));

                if (
                  Number.isNaN(start) ||
                  Number.isNaN(end) ||
                  !isValidPortNumber(start) ||
                  !isValidPortNumber(end) ||
                  start >= end
                ) {
                  throw new Error(`${portType} port range "${port}" is invalid. Must be two valid ports (0-65535) separated by a hyphen, with the first port smaller than the second.`);
                }
              } else {
                const singlePort = parseInt(port, 10);

                if (Number.isNaN(singlePort) || !isValidPortNumber(singlePort)) {
                  throw new Error(`${portType} port "${port}" is invalid. Must be a number between 0 and 65535.`);
                }
              }
            });
          };

          const targetsArray = formData.targets
            ? formData.targets.split('\n').map(target => target.trim()).filter(target => target !== '')
            : [];
          const validateTargets = (targets: string[], scanType: string) => {
            const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
            const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
            const nodeNameRegex = /^[a-zA-Z0-9_-]+$/;

            targets.forEach((target, index) => {
              if (scanType === "1") {
                // IPv4
                if (!ipv4Regex.test(target)) {
                  throw new Error(`Invalid IPv4 address at line ${index + 1}: ${target}`);
                }
              } else if (scanType === "2") {
                // IPv6
                if (!ipv6Regex.test(target)) {
                  throw new Error(`Invalid IPv6 address at line ${index + 1}: ${target}`);
                }
              } else if (scanType === "3") {
                // Node name Group
                if (!domainRegex.test(target)) {
                  throw new Error(`Invalid domain name at line ${index + 1}: ${target}`);
                }
              } else if (scanType === "4") {
                // Node name
                if (!nodeNameRegex.test(target)) {
                  throw new Error(`Invalid node name at line ${index + 1}: ${target}`);
                }
              } else {
                throw new Error(`Invalid scan type: ${scanType}`);
              }
            });
          };

          validateTargets(targetsArray, String(formData.scanType));
          validatePorts(formData.tcpPorts, 'TCP');
          validatePorts(formData.udpPorts, 'UDP');

          const baseTaskData = {
            typeOfTask: Number(formData.taskType),
            name: formData.taskName,
            executeNow: formData.executionType,
            priority: Number(formData.priority),
          };
          let taskData;

          if (formData.taskType === '1') {
            taskData = {
              ...baseTaskData,
              typeOfTarget:formData.scanType,
              onlyHostDetection: formData.hostDetection,
              saveAsNodeGroup: formData.saveAsNodeGroup,
              targets: targetsArray,
              tcpPorts: formData.tcpPorts.split(/[,\s]+/).filter(port => port !== ''),
              udpPorts: formData.udpPorts.split(/[,\s]+/).filter(port => port !== ''),
            };
          } else {
            taskData = {
              ...baseTaskData,
              usingNodeGroupType: formData.pocTargetNode,
              isAllRules: formData.targetCheck,
              pocRules: formData.selectedPocs,
              usingNodeGroup:formData.selectedNode,
            };
          }

          const advancedConfig = {
            cycleExecutionNumber: parseInt(formData.cycleExecutionNumber, 10),
            cycleExecution: formData.cycleExecution,
            exceptionIPType: formData.exceptionIPType,
            exceptionIP: formData.exceptionIP,
            detectionSpeed: formData.detectionSpeed,
            waitTime: formData.waitTime,
            intervalTime: formData.intervalTime,
            retryTimes: formData.retryTimes,
            saveActiveData: formData.saveActiveData,
            saveAsExceptionGroup: formData.saveAsExceptionGroup,
            addPrivate: formData.addPrivate,
          };

          const finalTaskData = {
            ...taskData,
            advancedConfiguration: advancedConfig,
          };
      if(formData.taskType==="1"){
          const response = await axios.post(
            'http://172.18.17.113:8888/taskManage/addNodeTask',
            taskData,
            {
              timeout: 5000, // 设置超时时间
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );}
          else{
            const response = await axios.post(
            'http://172.18.17.113:8888/taskManage/addPocTask',
            taskData,
            {
              timeout: 5000, // 设置超时时间
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
          console.log(response)
          }
          Message.success('Task created successfully');
          console.log(taskData);
        } catch (error) {
          Message.error(error.message || 'Submission failed. Please check your input and try again.');
        }
      };

      const beforeUpload = (file: File) => {
        fileList.value.push(file);
        return false;
      };

      const clearFileList = () => {
        fileList.value = [];
      };

      const isModalVisible = ref(false);
      const advancedConfiguration = () => {
        isModalVisible.value = true;
      };

      const handleOk = () => {
        isModalVisible.value = false;
      };

      const handleCancel = () => {
        isModalVisible.value = false;
      };

      const onRemoveFile = (file: any) => {
        const index = fileList.value.indexOf(file);
        if (index !== -1) {
          fileList.value.splice(index, 1);
        }
      };

      const resetForm = () => {
        Object.assign(formData, {
          taskName: '',
          taskType: "1",
          pocTaskName: '',
          selectedPocs: [],
          pocTargetNode: '',
          cycleExecutionNumber: 1,
          cycleExecution: '',
          executionType: '立即执行',
          exceptionIPType: '手动输入',
          exceptionIP: '',
          priority: '1',
          detectionSpeed: '快速探测',
          waitTime: 5,
          intervalTime: 500,
          retryTimes: 3,
          saveActiveData: false,
          saveAsExceptionGroup: false,
          addPrivate: false,
          scanType: 1,
          targets: '',
          saveAsNodeGroup: false,
          tcpPorts: '',
          udpPorts: '',
          hostDetection: false,
          targetCheck: false,
          selectedNode:''
        });
        fileList.value = [];
      };
      const handlePocTargetNodeChange = async (value) => {
        if (value === '手动分配') {
          try {
            const response = await axios.get('http://172.18.17.113:8888/taskManage/getAllNodeGroup');
            availableNodes.value = response.data.data;
          } catch (error) {
            Message.error('Failed to fetch nodes. Please try again.');
          }
        }
      };
      return {
        formData,
        pocOptions,
        fileList,
        handleTaskTypeChange,
        onSubmit,
        beforeUpload,
        clearFileList,
        onRemoveFile,
        resetForm,
        isModalVisible,
        handleOk,
        handleCancel,
        taskNamePlaceholder,
        targetsPlaceholder,
        portsPlaceholder,
        advancedConfiguration,
        availableNodes,
        handlePocTargetNodeChange,
        handleScanTypeChange,
      };
    },
  });
</script>

<style scoped>
  .task-form {
    max-width: 600px;
    margin: 0 auto;
  }
</style>
