<template>
  <basic-container>
    <a-space>
      <a-button type="primary" @click="showAddPortModal">新增</a-button>
      <a-button
        type="primary"
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="bulkDelete"
        >批量删除选中项
      </a-button>
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="请输入别名"
        button-text="搜索"
        search-button
        @search="searchAKAname"
      />
    </a-space>

    <p></p>

    <!-- User Table -->
    <a-space direction="vertical" size="large" fill>
      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="AKAname"
        :columns="columns"
        :data="filteredData"
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true,
          onlyCurrent: false,
        }"
      >
        <template #optional="{ record }">
          <a-space>
            <a-button type="primary" @click="handleEdit(record)"
              >编辑
            </a-button>
            <a-popconfirm
              content="确定删除该组别吗？"
              @ok="handleDelete(record.AKAname)"
            >
              <a-button type="primary" status="danger">删除 </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-space>

    <!-- Add/Edit User Modal -->
    <a-modal
      v-model:visible="isAddUserModalVisible"
      title="新增/编辑用户"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleAddOrEditUser"
      @cancel="closeAddUserModal"
    >
      <a-form :model="addUserForm">
        <a-form-item label="别名" required>
          <a-input v-model="addUserForm.AKAname" placeholder="请输入别名" />
        </a-form-item>
        <a-form-item label="例外IP段" required>
          <a-textarea
            v-model="addUserForm.ipRange"
            placeholder="请输入多个IP段，用换行分隔"
            rows="4"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="addUserForm.remark" placeholder="备注" />
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
      const isAddUserModalVisible = ref(false);
      const editMode = ref(false); // 用于区分新增和编辑模式

      // 响应式表单数据
      const addUserForm = reactive({
        AKAname: '',
        ipRange: '',
        remark: '',
      });

      const searchKeyword = ref(''); // 搜索关键字

      const data = ref([
        { AKAname: '组1', ipRange: '192.168.1.1', remark: '' },
        { AKAname: '组2', ipRange: '10.0.0.1', remark: '' },
      ]);

      const columns = reactive([
        { title: '别名', dataIndex: 'AKAname', key: 'AKAname' },
        { title: '例外IP段', dataIndex: 'ipRange', key: 'ipRange' },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '操作', slotName: 'optional' },
      ]);

      // 基于搜索关键字过滤数据
      const filteredData = computed(() => {
        if (!searchKeyword.value) return data.value;
        return data.value.filter((item) =>
          item.AKAname.includes(searchKeyword.value)
        );
      });

      // 重置表单数据
      const resetForm = () => {
        Object.assign(addUserForm, {
          AKAname: '',
          ipRange: '',
          remark: '',
        });
      };

      // 显示新增用户弹窗
      const showAddPortModal = () => {
        resetForm();
        editMode.value = false; // 新增用户时，编辑模式为false
        isAddUserModalVisible.value = true;
      };

      // 关闭弹窗
      const closeAddUserModal = () => {
        isAddUserModalVisible.value = false;
        resetForm();
      };

      // 编辑用户
      const handleEdit = (record) => {
        Object.assign(addUserForm, { ...record });
        isAddUserModalVisible.value = true;
        editMode.value = true; // 编辑模式
      };

      // 保存新增或编辑用户
      const handleAddOrEditUser = () => {
        if (!addUserForm.AKAname) {
          message.error('请填写所有必填字段');
          return;
        }

        if (editMode.value) {
          // 编辑模式，找到并更新数据
          const userIndex = data.value.findIndex(
            (user) => user.AKAname === addUserForm.AKAname
          );
          if (userIndex !== -1) {
            data.value[userIndex] = { ...addUserForm }; // 更新用户信息
            message.success('组别更新成功');
          }
        } else {
          // 新增用户
          data.value.push({ ...addUserForm });
          message.success('组别新增成功');
        }

        closeAddUserModal();
      };

      // 删除用户
      const handleDelete = (AKAname) => {
        Modal.confirm({
          title: '确认删除',
          content: `你确定要删除组别 ${AKAname} 吗？`,
          onOk: () => {
            data.value = data.value.filter((item) => item.AKAname !== AKAname);
            message.success(`用户 ${AKAname} 已删除`);
          },
        });
      };

      // 批量删除
      const bulkDelete = () => {
        if (selectedKeys.value.length === 0) {
          message.warning('请先选择要删除的用户');
          return;
        }

        Modal.confirm({
          title: '确认删除',
          content: '你确定要删除选中的组别吗？',
          onOk: () => {
            data.value = data.value.filter(
              (item) => !selectedKeys.value.includes(item.AKAname)
            );
            selectedKeys.value = [];
            message.success('该组别删除成功');
          },
        });
      };

      // 搜索组别
      const searchAKAname = (value) => {
        searchKeyword.value = value.trim();
      };

      return {
        selectedKeys,
        isAddUserModalVisible,
        addUserForm,
        data,
        columns,
        filteredData,
        searchAKAname,
        showAddPortModal,
        closeAddUserModal,
        handleDelete,
        bulkDelete,
        handleEdit,
        handleAddOrEditUser,
      };
    },
  };
</script>

<style scoped lang="less"></style>
