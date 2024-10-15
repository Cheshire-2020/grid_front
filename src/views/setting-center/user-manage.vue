<template>
  <basic-container>
    <a-space>
      <a-button type="primary" @click="showAddUserModal">新增</a-button>
      <a-button
          type="primary"
          status="danger"
          :disabled="selectedKeys.length === 0"
          @click="bulkDelete"
      >批量删除选中项
      </a-button>
      <a-input-search
          :style="{ width: '320px' }"
          placeholder="请输入用户名"
          button-text="搜索"
          search-button
          @search="searchUser"
      />
    </a-space>

    <p></p>

    <!-- User Table -->
    <a-space direction="vertical" size="large" fill>
      <a-table
          v-model:selectedKeys="selectedKeys"
          row-key="username"
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
            <a-button
                type="primary"
                @click="handleEdit(record)"
            >编辑
            </a-button>
            <a-popconfirm
                content="确定删除该用户吗？"
                @ok="handleDelete(record.username)"
            >
              <a-button
                  type="primary"
                  status="danger"
              >删除
              </a-button>
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
        <a-form-item label="用户名" required>
          <a-input v-model="addUserForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="输入密码" required>
          <a-input-password
              v-model="addUserForm.password"
              placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item label="确认密码" required>
          <a-input-password
              v-model="addUserForm.confirmPassword"
              placeholder="请再次输入密码"
          />
        </a-form-item>
        <a-form-item label="用户类型" required>
          <a-select v-model="addUserForm.userType">
            <a-option value="user">普通用户</a-option>
            <a-option value="admin">管理员</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="addUserForm.remark" placeholder="请输入备注" />
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
      username: '',
      password: '',
      confirmPassword: '',
      userType: '普通用户',
      remark: '',
    });

    const searchKeyword = ref(''); // 搜索关键字

    const data = ref([
      { username: 'admin', userType: '管理员', remark: '系统管理员' },
      { username: 'testuser', userType: '普通用户', remark: '测试用户' },
    ]);

    const columns = reactive([
      { title: '用户名', dataIndex: 'username', key: 'username' },
      { title: '用户类型', dataIndex: 'userType', key: 'userType' },
      { title: '备注', dataIndex: 'remark', key: 'remark' },
      { title: '操作', slotName: 'optional' },
    ]);

    // 基于搜索关键字过滤数据
    const filteredData = computed(() => {
      if (!searchKeyword.value) return data.value;
      return data.value.filter((item) =>
          item.username.includes(searchKeyword.value)
      );
    });

    // 重置表单数据
    const resetForm = () => {
      Object.assign(addUserForm, {
        username: '',
        password: '',
        confirmPassword: '',
        userType: '普通用户',
        remark: '',
      });
    };

    // 显示新增用户弹窗
    const showAddUserModal = () => {
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
      if (!addUserForm.username || !addUserForm.password || !addUserForm.confirmPassword) {
        message.error('请填写所有必填字段');
        return;
      }
      if (addUserForm.password !== addUserForm.confirmPassword) {
        message.error('密码和确认密码不一致');
        return;
      }

      if (editMode.value) {
        // 编辑模式，找到并更新数据
        const userIndex = data.value.findIndex((user) => user.username === addUserForm.username);
        if (userIndex !== -1) {
          data.value[userIndex] = { ...addUserForm }; // 更新用户信息
          message.success('用户更新成功');
        }
      } else {
        // 新增用户
        data.value.push({ ...addUserForm });
        message.success('用户新增成功');
      }

      closeAddUserModal();
    };

    // 删除用户
    const handleDelete = (username) => {
      Modal.confirm({
        title: '确认删除',
        content: `你确定要删除用户 ${username} 吗？`,
        onOk: () => {
          data.value = data.value.filter((item) => item.username !== username);
          message.success(`用户 ${username} 已删除`);
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
        content: '你确定要删除选中的用户吗？',
        onOk: () => {
          data.value = data.value.filter(
              (item) => !selectedKeys.value.includes(item.username)
          );
          selectedKeys.value = [];
          message.success('用户删除成功');
        },
      });
    };

    // 搜索用户
    const searchUser = (value) => {
      searchKeyword.value = value.trim();
    };

    return {
      selectedKeys,
      isAddUserModalVisible,
      addUserForm,
      data,
      columns,
      filteredData,
      searchUser,
      showAddUserModal,
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
