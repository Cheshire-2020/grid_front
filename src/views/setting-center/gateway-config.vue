<template>
  <basic-container>
    <a-space>
      <a-button type="primary" @click="showAddModal">新增</a-button>
    </a-space>

    <p></p>

    <!-- User Table -->
    <a-space direction="vertical" size="large" fill>
      <a-table row-key="id" :columns="columns" :data="data">
        <template #optional="{ record }">
          <a-space>
            <a-button type="primary" @click="handleEdit(record)"
              >编辑
            </a-button>
            <a-popconfirm
              content="确定删除该配置吗？"
              @ok="handleDelete(record.ip)"
            >
              <a-button type="primary" status="danger">删除 </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-space>

    <!-- Add/Edit User Modal -->
    <a-modal
      v-model:visible="isAddModalVisible"
      title="新增/编辑配置"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleAddOrEdit"
      @cancel="closeAddModal"
    >
      <a-form :model="GatewayForm">
        <a-form-item label="IP" required>
          <a-input v-model="GatewayForm.ip" placeholder="请输入IP" />
        </a-form-item>
        <a-form-item label="端口" required>
          <a-input v-model="GatewayForm.port" placeholder="请输入端口" />
        </a-form-item>
        <a-form-item label="组织" required>
          <a-input v-model="GatewayForm.org" placeholder="请输入组织" />
        </a-form-item>
        <a-form-item label="版本" required>
          <a-select v-model="GatewayForm.GatewayVersion">
            <a-option value="V1">V1</a-option>
            <a-option value="V2">V2</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="间隔时间">
          <a-input-number
            v-model="GatewayForm.interval"
            min="30"
            placeholder="请输入间隔时间"
          />
        </a-form-item>
        <a-form-item label="测试链接">
          <a href="#">点击测试</a>
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
      const isAddModalVisible = ref(false);
      const editMode = ref(false); // 用于区分新增和编辑模式

      // 响应式表单数据
      const GatewayForm = reactive({
        id: '',
        ip: '',
        port: '',
        org: '',
        GatewayVersion: '',
        interval: null,
      });

      const searchKeyword = ref(''); // 搜索关键字

      const data = ref([
        {
          id: '1',
          ip: '10.0.0.1',
          port: '8080',
          org: '办公室',
          GatewayVersion: 'V2',
          interval: 1000,
        },
        {
          id: '2',
          ip: '192.168.0.1',
          port: '3306',
          org: '开发部门',
          GatewayVersion: 'V1',
          interval: 1000,
        },
      ]);

      const columns = reactive([
        { title: 'IP', dataIndex: 'ip', key: 'ip' },
        { title: '端口', dataIndex: 'port', key: 'port' },
        { title: '组织', dataIndex: 'org', key: 'org' },
        { title: '版本', dataIndex: 'GatewayVersion', key: 'GatewayVersion' },
        { title: '间隔时间', dataIndex: 'interval', key: 'interval' },
        { title: '操作', slotName: 'optional' },
      ]);

      // 重置表单数据
      const resetForm = () => {
        Object.assign(GatewayForm, {
          id: '',
          ip: '',
          port: '',
          org: '',
          GatewayVersion: '',
          interval: null,
        });
      };

      // 显示新增配置弹窗
      const showAddModal = () => {
        resetForm();
        editMode.value = false; // 新增配置时，编辑模式为false
        isAddModalVisible.value = true;
      };

      // 关闭弹窗
      const closeAddModal = () => {
        isAddModalVisible.value = false;
        resetForm();
      };

      // 编辑配置
      const handleEdit = (record) => {
        Object.assign(GatewayForm, { ...record });
        isAddModalVisible.value = true;
        editMode.value = true; // 编辑模式
      };

      // 保存新增或编辑配置
      const handleAddOrEdit = () => {
        if (
          !GatewayForm.ip ||
          !GatewayForm.port ||
          !GatewayForm.org ||
          !GatewayForm.GatewayVersion
        ) {
          message.error('请填写所有必填字段');
          return;
        }

        if (editMode.value) {
          // 编辑模式，找到并更新数据
          const userIndex = data.value.findIndex(
            (user) => user.id === GatewayForm.id
          );
          if (userIndex !== -1) {
            data.value[userIndex] = { ...GatewayForm, id: Date.now() }; // 更新网络配置信息
            message.success('网络配置更新成功');
          }
        } else {
          // 新增网络配置
          data.value.push({ ...GatewayForm, id: Date.now() });
          message.success('网络配置新增成功');
        }

        closeAddModal();
      };

      // 删除网络配置
      const handleDelete = (ip) => {
        Modal.confirm({
          title: '确认删除',
          content: `你确定要删除网络配置 ${ip} 吗？`,
          onOk: () => {
            data.value = data.value.filter((item) => item.ip !== ip);
            message.success(`网络配置 ${ip} 已删除`);
          },
        });
      };

      return {
        isAddModalVisible,
        GatewayForm,
        data,
        columns,
        showAddModal,
        closeAddModal,
        handleDelete,
        handleEdit,
        handleAddOrEdit,
      };
    },
  };
</script>

<style scoped lang="less"></style>
