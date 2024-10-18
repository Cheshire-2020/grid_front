<template>
  <basic-container>
    <a-space>
      <a-button type="primary" @click="showAddNodeModal">新增探测节点</a-button>
      <a-input-search
        placeholder="输入节点名称/地址"
        style="width: 300px"
        @search="searchNodename"
      />
      <a-button
        type="primary"
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="bulkDelete"
      >
        批量删除选中项
      </a-button>
      <a-button type="primary" @click="refreshData">刷新</a-button>
      <a-button type="primary" @click="adjustNodes">调整</a-button>
      <a-button type="primary" @click="restartNodes">重启</a-button>
    </a-space>

    <p></p>

    <!-- Table for detection nodes -->
    <a-space direction="vertical" size="large" fill>
      <a-table
        v-model:selectedKeys="selectedKeys"
        :columns="columns"
        :data="filteredData"
        row-key="ip"
        pagination
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true,
          onlyCurrent: false,
        }"
      >
        <!-- Define custom slots for actions and resource progress -->
        <template #action="{ record }">
          <a-space>
            <a-button type="primary" @click="handleEdit(record)">
              <icon-edit /> 编辑
            </a-button>
            <a-popconfirm
              content="确定删除该节点吗？"
              @ok="handleDelete(record.ip)"
            >
              <a-button type="primary" status="danger">
                <icon-delete /> 删除
              </a-button>
            </a-popconfirm>
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

      <template #task="{ record }">
        <a-button type="link" @click="viewTaskDetails(record)">
          查看任务详情
        </a-button>
      </template>
    </a-space>

    <!-- Add/Edit Node Modal -->
    <a-modal
      v-model:visible="isAddNodeModalVisible"
      title="新增探测节点"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleAddOrEditNode"
      @cancel="closeAddNodeModal"
    >
      <a-form :model="addNodeForm">
        <a-form-item label="节点名称" required>
          <a-input v-model="addNodeForm.name" placeholder="请输入节点名称" />
        </a-form-item>
        <a-form-item label="IP 地址" required>
          <a-input v-model="addNodeForm.ip" placeholder="请输入节点IP地址" />
        </a-form-item>
        <a-form-item label="所属地区" required>
          <a-input v-model="addNodeForm.region" placeholder="请输入节点地区" />
        </a-form-item>
        <a-form-item label="探测节点类型" required>
          <a-radio-group v-model="addNodeForm.type">
            <a-radio value="IP存活探测">IP存活探测</a-radio>
            <a-radio value="深度探测">深度探测</a-radio>
            <a-radio value="POC探测">POC探测</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="addNodeForm.remark" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </basic-container>
</template>

<script>
  import { ref, reactive, computed } from 'vue';
  import BasicContainer from '@/layout/basic-container.vue';
  import { Modal, message } from 'ant-design-vue';

  export default {
    components: { BasicContainer },
    setup() {
      const selectedKeys = ref([]);
      const isAddNodeModalVisible = ref(false);
      const editMode = ref(false);
      const searchKeyword = ref('');

      const addNodeForm = reactive({
        name: '',
        ip: '',
        region: '',
        type: 'IP存活探测', // 默认类型
        remark: '',
      });

      const data = ref([
        {
          ip: '1.66.112.223',
          name: 'pktgen_engine_name111',
          region: '辽宁 移动',
          type: 'IP存活探测',
          cpu: 0.8,
          memory: 0.3,
          disk: 0.12,
          status: '在线',
          task: '未触发',
        },
        {
          ip: '1.83.124.115',
          name: 'hotvun_engine_name111',
          region: '吉林 联通',
          type: 'PoC探测',
          cpu: 0.88,
          memory: 0.9,
          disk: 0.22,
          status: '在线',
          task: '未触发',
        },
        {
          ip: '127.0.0.1',
          name: 'local',
          region: '本地机',
          type: '深度探测',
          cpu: 0.12,
          memory: 0.3,
          disk: 0.6,
          status: '在线',
          task: '未触发',
        },
      ]);

      const columns = reactive([
        { title: '探测节点IP', dataIndex: 'ip', key: 'ip' },
        { title: '探测节点名称', dataIndex: 'name', key: 'name' },
        { title: '所属地区', dataIndex: 'region', key: 'region' },
        { title: '探测节点类型', dataIndex: 'type', key: 'type' },
        { title: 'CPU', key: 'cpu', slotName: 'cpu' },
        { title: '内存', key: 'memory', slotName: 'memory' },
        { title: '磁盘', key: 'disk', slotName: 'disk' },
        { title: '任务', dataIndex: 'task', slotName: 'task' },
        { title: '操作', slotName: 'action' },
      ]);

      const filteredData = computed(() => {
        if (!searchKeyword.value) return data.value;
        return data.value.filter(
          (item) =>
            item.name.includes(searchKeyword.value) ||
            item.ip.includes(searchKeyword.value)
        );
      });

      const resetForm = () => {
        Object.assign(addNodeForm, {
          name: '',
          ip: '',
          region: '',
          type: '',
          remark: '',
        });
      };

      const showAddNodeModal = () => {
        resetForm();
        editMode.value = false;
        isAddNodeModalVisible.value = true;
      };

      const closeAddNodeModal = () => {
        isAddNodeModalVisible.value = false;
        resetForm();
      };

      const handleEdit = (record) => {
        Object.assign(addNodeForm, { ...record });
        editMode.value = true;
        isAddNodeModalVisible.value = true;
      };

      const handleAddOrEditNode = () => {
        if (!addNodeForm.name || !addNodeForm.ip) {
          message.error('请填写所有必填字段');
          return;
        }

        if (editMode.value) {
          const index = data.value.findIndex(
            (node) => node.ip === addNodeForm.ip
          );
          if (index !== -1) {
            data.value[index] = { ...addNodeForm };
            message.success('节点更新成功');
          }
        } else {
          data.value.push({ ...addNodeForm });
          message.success('节点新增成功');
        }
        closeAddNodeModal();
      };

      const handleDelete = (ip) => {
        Modal.confirm({
          title: '确认删除',
          content: `你确定要删除节点 ${ip} 吗？`,
          onOk: () => {
            data.value = data.value.filter((item) => item.ip !== ip);
            message.success(`节点 ${ip} 已删除`);
          },
        });
      };

      const bulkDelete = () => {
        if (selectedKeys.value.length === 0) {
          message.warning('请先选择要删除的节点');
          return;
        }

        Modal.confirm({
          title: '确认删除',
          content: '你确定要删除选中的节点吗？',
          onOk: () => {
            data.value = data.value.filter(
              (item) => !selectedKeys.value.includes(item.ip)
            );
            selectedKeys.value = [];
            message.success('选中的节点已删除');
          },
        });
      };

      const searchNodename = (value) => {
        searchKeyword.value = value.trim();
      };

      const refreshData = () => {
        message.success('数据刷新成功');
        // Add logic to fetch new data if needed
      };

      const adjustNodes = () => {
        message.success('调整操作已完成');
      };

      const restartNodes = () => {
        message.success('节点重启成功');
      };

      const viewTaskDetails = (record) => {
        // Redirect to task detail page or open modal
        console.log('Redirecting to task details for:', record);
      };

      return {
        selectedKeys,
        columns,
        data,
        filteredData,
        isAddNodeModalVisible,
        addNodeForm,
        showAddNodeModal,
        handleAddOrEditNode,
        handleEdit,
        handleDelete,
        bulkDelete,
        searchNodename,
        refreshData,
        adjustNodes,
        restartNodes,
        closeAddNodeModal,
        viewTaskDetails,
      };
    },
  };
</script>

<style scoped lang="less"></style>
