<template>
  <a-page-header title="新建任务" />

  <a-form :model="formData" @submit="onSubmit" class="task-form">
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
        <a-radio value="结点探测">结点探测</a-radio>
        <a-radio value="POC结点探测">POC结点探测</a-radio>
      </a-radio-group>
    </a-form-item>

    <!-- 节点探测表单 -->
    <div v-if="formData.taskType === '结点探测'">
      <!-- 扫描类型 -->
      <a-form-item field="scanType" label="扫描类型">
        <a-radio-group
          v-model="formData.scanType"
          @change="handleTaskTypeChange"
        >
          <a-radio value="1">ipv4</a-radio>
          <a-radio value="2">ipv6</a-radio>
          <a-radio value="3">域名</a-radio>
          <a-radio value="4">结点名称</a-radio>
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
        <a-button type="default" @click="clearFileList">取消导入</a-button>
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
    <div v-if="formData.taskType === 'POC结点探测'">
      <!-- PoC任务名称输入 -->
      <a-form-item label="PoC任务名称">
        <a-input
          v-model="formData.pocTaskName"
          placeholder="请输入PoC任务名称"
        />
      </a-form-item>

      <!-- PoC规则选择 -->
      <a-form-item label="PoC规则">
        <a-transfer
          :data-source="pocOptions"
          v-model="formData.selectedPocs"
          :titles="['可选规则', '已选规则']"
          filterable
        />
      </a-form-item>

      <!-- PoC探测节点分配 -->
      <a-form-item label="PoC探测节点分配">
        <a-select
          v-model="formData.pocTargetNode"
          placeholder="请选择节点分配方式"
        >
          <a-select-option value="随机分配">随机分配</a-select-option>
          <a-select-option value="手动分配">手动分配</a-select-option>
        </a-select>
      </a-form-item>
    </div>

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

  export default defineComponent({
    name: 'TaskForm',
    setup() {
      const formData = reactive({
        taskName: '',
        taskType: '结点探测',
        scanType: 1,
        targets: '', // 初始化为字符串
        saveAsNodeGroup: false,
        setAsPrivate: false,
        avgTargetDistribution: false,
        tcpPorts: '',
        udpPorts: '',
        hostDetection: false,
        pocTaskName: '',
        selectedPocs: [],
        pocTargetNode: '',
      });

      const fileList = ref([]);

      const pocOptions = [
        { key: '1', title: 'GitLab Graphql API任意用户查询漏洞' },
        { key: '2', title: '锐捷RG-UAC统一网关漏洞' },
        { key: '3', title: 'Exchange服务器远程命令执行漏洞' },
        { key: '4', title: '多个业务安全网关命令执行漏洞' },
      ];

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

      const handleTaskTypeChange = (value: string) => {
        console.log('任务类型切换为:', value);
      };
      const onSubmit = async () => {
        try {
          // 端口格式验证正则表达式
          const portRegex = /^(\d+(-\d+)?)(\s*,\s*(\d+(-\d+)?))*$/;

          // 验证函数
          const validatePorts = (ports, portType) => {
            if (ports && !portRegex.test(ports)) {
              throw new Error(
                `${portType}端口输入格式不正确，请输入数字或数字范围，多个端口用逗号分隔。`
              );
            }
          };

          // 处理 targets，将字符串转换为数组（每一行一个目标）
          const targetsArray = formData.targets
            ? formData.targets
                .split('\n')
                .map((target) => target.trim())
                .filter((target) => target !== '')
            : [];

          // 处理端口，将字符串转换为数组
          const processPorts = (ports) =>
            ports ? ports.split(/[\s,]+/).filter((port) => port !== '') : [];

          // 验证端口
          validatePorts(formData.tcpPorts, 'TCP');
          validatePorts(formData.udpPorts, 'UDP');

          // 创建符合 ScanTask 类属性名的新的表单数据对象
          const updatedFormData = {
            typeOfTask: formData.taskType, // 映射为 Java 类的 typeOfTask
            name: formData.taskName, // 映射为 Java 类的 name
            typeOfTarget: formData.scanType, // 映射为 Java 类的 typeOfTarget
            targets: targetsArray, // 处理后的 targets 数组
            saveAsNodeGroup: formData.saveAsNodeGroup,
            onlyHostDetection: formData.hostDetection,
            tcpPorts: processPorts(formData.tcpPorts), // 处理后的 TCP 端口数组
            udpPorts: processPorts(formData.udpPorts), // 处理后的 UDP 端口数组
          };

          // 输出处理后的表单数据，您可以在此处替换为 API 调用
          console.log('Form data to be submitted:', updatedFormData);

          // 这里应该是您的提交逻辑，可能是一个 API 调用，例如：
          // await submitFormToAPI(updatedFormData);

          Message.success('任务创建成功');
        } catch (error) {
          console.error('提交表单时发生错误:', error);
          Message.error(error.message || '提交失败，请检查输入并重试。');
        }
      };

      const beforeUpload = (file: File) => {
        fileList.value.push(file);
        return false;
      };

      const clearFileList = () => {
        fileList.value = [];
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
          taskType: '结点探测',
          scanType: 'ipv4',
          targets: '', // 重置为字符串
          saveAsNodeGroup: false,
          setAsPrivate: false,
          avgTargetDistribution: false,
          tcpPorts: '',
          udpPorts: '',
          hostDetection: false,
          pocTaskName: '',
          selectedPocs: [],
          pocTargetNode: '',
        });
        fileList.value = [];
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
        taskNamePlaceholder,
        targetsPlaceholder,
        portsPlaceholder,
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
