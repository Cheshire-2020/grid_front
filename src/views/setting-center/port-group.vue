<template>
  <div class="container">
    <div class="full-height-panel-container">
      <!-- 新增、批量删除按钮 -->
      <a-space>
        <a-button type="primary" @click="openAddModal">新增</a-button>
        <a-button
          type="primary"
          :disabled="selectedRowKeys.length === 0"
          @click="batchDelete"
          >批量删除</a-button
        >
      </a-space>

      <!-- 表格展示 -->
      <a-table
        row-key="id"
        :columns="columns"
        :data="data"
        :row-selection="{
          selectedRowKeys,
          onChange: handleSelectionChange,
        }"
        pagination
      >
        <template #action="{ record }">
          <a-space>
            <a-button type="primary" @click="openEditModal(record)">
              <icon-edit />
              编辑
            </a-button>
            <a-popconfirm
              content="确定删除该节点组吗？"
              @ok="handleDelete(record.id)"
            >
              <a-button
                type="primary"
                status="danger"
                @click="handleDelete(record)"
              >
                <icon-delete />
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>

      <!-- 新增端口组的表单弹窗 -->
      <a-modal
        v-model:visible="visible"
        title="新增端口组"
        @ok="handleAdd"
        @cancel="closeAddModal"
      >
        <a-form
          ref="addFormRef"
          :model="addForm"
          :rules="rules"
          label-align="right"
        >
          <a-form-item label="别名" field="alias">
            <a-input v-model="addForm.alias" />
          </a-form-item>
          <a-form-item label="TCP端口" field="tcpPort">
            <a-input v-model="addForm.tcpPort" />
          </a-form-item>
          <a-form-item label="UDP端口" field="udpPort">
            <a-input v-model="addForm.udpPort" />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 编辑端口组的表单弹窗 -->
      <a-modal
        v-model:visible="isEditModalVisible"
        title="编辑端口组"
        @ok="handleEdit"
        @cancel="closeEditModal"
      >
        <a-form ref="editFormRef" :model="editForm" label-align="right">
          <a-form-item label="别名" field="alias">
            <a-input v-model="editForm.alias" />
          </a-form-item>
          <a-form-item label="TCP端口" field="tcpPort">
            <a-input v-model="editForm.tcpPort" />
          </a-form-item>
          <a-form-item label="UDP端口" field="udpPort">
            <a-input v-model="editForm.udpPort" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue';

  export default {
    setup() {
      const data = ref([
        { id: 1, alias: '组1', tcpPort: '8080,9090', udpPort: '8000,9000' },
        { id: 2, alias: '组2', tcpPort: '7070', udpPort: '6000' },
      ]);

      const selectedRowKeys = ref([]);

      const handleSelectionChange = (selectedKeys) => {
        console.log('Selected Row Keys: ', selectedKeys);
        selectedRowKeys.value = selectedKeys;
      };

      const columns = ref([
        { title: '别名', dataIndex: 'alias', key: 'alias' },
        { title: 'TCP端口', dataIndex: 'tcpPort', key: 'tcpPort' },
        { title: 'UDP端口', dataIndex: 'udpPort', key: 'udpPort' },
        {
          title: '操作',
          slotName: 'action',
        },
      ]);

      const isAddModalVisible = ref(false);
      const isEditModalVisible = ref(false);

      const addForm = ref({ alias: '', tcpPort: '', udpPort: '' });
      const editForm = ref({ alias: '', tcpPort: '', udpPort: '' });

      const rules = ref({
        alias: [{ required: true, message: '别名是必填项', trigger: 'blur' }],
      });

      const openAddModal = () => {
        isAddModalVisible.value = true;
      };

      const closeAddModal = () => {
        isAddModalVisible.value = false;
      };

      const handleAdd = () => {
        data.value.push({ id: data.value.length + 1, ...addForm.value });
        closeAddModal();
      };

      const openEditModal = (record) => {
        editForm.value = { ...record };
        isEditModalVisible.value = true;
      };

      const closeEditModal = () => {
        isEditModalVisible.value = false;
      };

      const handleEdit = () => {
        const index = data.value.findIndex(
          (item) => item.id === editForm.value.id
        );
        if (index !== -1) {
          data.value[index] = { ...editForm.value };
        }
        closeEditModal();
      };

      const handleDelete = (record) => {
        data.value = data.value.filter((item) => item.id !== record.id);
      };

      const batchDelete = () => {
        data.value = data.value.filter(
          (item) => !selectedRowKeys.value.includes(item.id)
        );
        selectedRowKeys.value = [];
      };

      return {
        data,
        columns,
        selectedRowKeys,
        handleSelectionChange,
        isAddModalVisible,
        isEditModalVisible,
        addForm,
        editForm,
        rules,
        openAddModal,
        closeAddModal,
        handleAdd,
        openEditModal,
        closeEditModal,
        handleEdit,
        handleDelete,
        batchDelete,
      };
    },
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0px;
  }
  .full-height-panel-container {
    width: 100%;
    height: 100%;
    padding: 20px;
  }
</style>
