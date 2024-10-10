<template>
  <basic-container>
    <a-space>
      <a-button type="primary" @click="showAddUserModal">新增</a-button>
      <a-button
        type="primary"
        status="danger"
        :disabled="selectedKeys.length === 0"
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
        :data="data"
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
              @click="$modal.info({ title: 'name', content: record.username })"
              >编辑
            </a-button>
            <a-button
              type="primary"
              status="danger"
              @click="$modal.info({ title: 'name', content: record.username })"
              >删除
            </a-button>
          </a-space>
        </template>
      </a-table>
    </a-space>

    <!-- Add User Modal -->
    <a-modal
      v-model:visible="isAddUserModalVisible"
      title="新增用户"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleAddUser"
      @cancel="closeAddUserModal"
    >
      <a-form :model="addUserForm">
        <!-- Username Input -->
        <a-form-item label="用户名" required>
          <a-input v-model="addUserForm.username" placeholder="请输入用户名" />
        </a-form-item>

        <!-- Password Input -->
        <a-form-item label="输入密码" required>
          <a-input-password
            v-model="addUserForm.password"
            placeholder="请输入密码"
          />
        </a-form-item>

        <!-- Confirm Password -->
        <a-form-item label="确认密码" required>
          <a-input-password
            v-model="addUserForm.confirmPassword"
            placeholder="请再次输入密码"
          />
        </a-form-item>

        <!-- User Type -->
        <a-form-item label="用户类型" required>
          <a-select v-model="addUserForm.userType">
            <a-option value="user">普通用户</a-option>
            <a-option value="admin">管理员</a-option>
          </a-select>
        </a-form-item>

        <!-- Remarks -->
        <a-form-item label="备注">
          <a-input v-model="addUserForm.remark" placeholder="请输入备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </basic-container>
</template>

<script>
  import BasicContainer from '@/layout/basic-container.vue';

  export default {
    components: { BasicContainer },
    data() {
      return {
        selectedKeys: [],
        isAddUserModalVisible: false,
        addUserForm: {
          inputMethod: 'manual', // Default to manual input
          username: '',
          password: '',
          confirmPassword: '',
          retryLimit: 5,
          timeout: 30,
          isActive: true,
          userType: '普通用户',
          allowedIp: '',
          remark: '',
        },
        columns: [
          { title: '用户名', dataIndex: 'username', key: 'username' },
          { title: '用户类型', dataIndex: 'userType', key: 'userType' },
          {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
          },
          {
            title: 'Optional',
            slotName: 'optional',
          },
        ],
        data: [
          {
            username: 'admin',
            userType: '管理员',
            remark: '系统管理员',
          },
          {
            username: 'testuser',
            userType: '普通用户',
            remark: '测试用户',
          },
        ],
        pagination: {
          pageSize: 500,
        },
      };
    },
    methods: {
      // Show the modal to add a new user
      showAddUserModal() {
        this.isAddUserModalVisible = true;
      },
      // Close the add user modal
      closeAddUserModal() {
        this.isAddUserModalVisible = false;
        this.resetForm();
      },
      // Handle the add user form submission
      handleAddUser() {
        if (
          !this.addUserForm.username ||
          !this.addUserForm.password ||
          !this.addUserForm.confirmPassword
        ) {
          this.$message.error('请填写所有必填字段');
          return;
        }
        if (this.addUserForm.password !== this.addUserForm.confirmPassword) {
          this.$message.error('密码和确认密码不一致');
          return;
        }

        // Add new user to the table
        this.data.push({ ...this.addUserForm });
        this.$message.success('用户新增成功');
        this.closeAddUserModal();
      },
      // Reset the form fields
      resetForm() {
        this.addUserForm = {
          inputMethod: 'manual',
          username: '',
          password: '',
          confirmPassword: '',
          retryLimit: 5,
          timeout: 30,
          isActive: true,
          userType: '普通用户',
          allowedIp: '',
          remark: '',
        };
      },
      // Edit user
      editUser() {
        if (this.selectedKeys.length === 1) {
          this.$message.success('编辑功能尚未实现');
        }
      },
      // Change user details
      changeUser() {
        this.$message.success('更改功能尚未实现');
      },
      // Delete selected users
      deleteUser() {
        this.$confirm({
          title: '确认删除',
          content: '你确定要删除选中的用户吗？',
          onOk: () => {
            this.data = this.data.filter(
              (item) => !this.selectedKeys.includes(item.username)
            );
            this.$message.success('用户删除成功');
          },
        });
      },
    },
  };
</script>

<style scoped lang="less"></style>
