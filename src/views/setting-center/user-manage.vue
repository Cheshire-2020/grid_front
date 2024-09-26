<template>
  <div class="container">
    <div class="full-height-panel-container">
      <p></p>
      <a-typography-text>用户管理</a-typography-text>
      <p></p>

      <!-- Action Buttons -->
      <a-space>
        <a-button type="primary" @click="showAddUserModal">新增</a-button>
        <a-button type="primary" :disabled="!selectedKeys.length" @click="editUser">编辑</a-button>
        <a-button type="primary" :disabled="!selectedKeys.length" @click="changeUser">更改</a-button>
        <a-button type="primary" :disabled="!selectedKeys.length" @click="deleteUser">删除</a-button>
        <a-button type="primary" @click="searchUserModal">搜索</a-button>
        <input type="text">
      </a-space>

      <p></p>

      <!-- User Table -->
      <a-space direction="vertical" size="large" fill>
        <a-table
          v-model:selectedKeys="selectedKeys"
          row-key="name"
          :columns="columns"
          :data="data"
          :row-selection="rowSelection"
          :pagination="pagination"
        />
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
          <!-- Manual or Bulk Input Selection -->
          <a-form-item label="输入方式" required>
            <a-radio-group v-model="addUserForm.inputMethod">
              <a-radio value="manual">手动输入</a-radio>
              <a-radio value="bulk">批量导入</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- Username Input -->
          <a-form-item label="用户名" required>
            <a-input v-model="addUserForm.username" placeholder="请输入用户名" />
          </a-form-item>

          <!-- Password Input -->
          <a-form-item label="输入密码" required>
            <a-input-password v-model="addUserForm.password" placeholder="请输入密码" />
          </a-form-item>

          <!-- Confirm Password -->
          <a-form-item label="确认密码" required>
            <a-input-password v-model="addUserForm.confirmPassword" placeholder="请再次输入密码" />
          </a-form-item>

          <!-- Password Retry Limit -->
          <a-form-item label="密码错误重试次数" required>
            <a-input-number v-model="addUserForm.retryLimit" :min="1" :max="5" />
          </a-form-item>

          <!-- Login Timeout -->
          <a-form-item label="登录超时时间 (min)" required>
            <a-input-number v-model="addUserForm.timeout" :min="1" :max="99999" />
          </a-form-item>

          <!-- Is an Active Account -->
          <a-form-item label="是否允许登录">
            <a-switch v-model="addUserForm.isActive" />
          </a-form-item>

          <!-- User Type -->
          <a-form-item label="用户类型">
            <a-select v-model="addUserForm.userType">
              <a-select-option value="普通用户">普通用户</a-select-option>
              <a-select-option value="管理员">管理员</a-select-option>
            </a-select>
          </a-form-item>

          <!-- Allowed IP -->
          <a-form-item label="允许登录IP">
            <a-input v-model="addUserForm.allowedIp" placeholder="输入允许的IP，不限制则留空" />
          </a-form-item>

          <!-- Remarks -->
          <a-form-item label="备注">
            <a-input v-model="addUserForm.remark" placeholder="请输入备注" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
export default {
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
        { title: '用户类型', dataIndex: 'userType', key: 'userType' },  // User Type (e.g., 普通用户, 管理员)
        { 
          title: '状态', 
          dataIndex: 'isActive', 
          key: 'isActive',
          // Display "启动" for active users and "关闭" for inactive users
          customRender: ({ isActive }) => (isActive ? '启动' : '关闭'),
        },
        { 
          title: '登陆错误次数锁定', 
          dataIndex: 'retryLimit', 
          key: 'retryLimit'  // How many times user can attempt incorrect login before lockout
        },
        { 
          title: '登录超时(min)', 
          dataIndex: 'timeout', 
          key: 'timeout'  // Timeout period in minutes for inactive sessions
        },
        {
          title: '允许登录IP',
          dataIndex: 'allowedIp',
          key: 'allowedIp'
        },
        { 
          title: '备注', 
          dataIndex: 'remark', 
          key: 'remark'
        },
      ],
      data: [
      {
          username: 'admin',
          userType: '管理员',
          isActive: true,  // '启动'
          retryLimit: 5,
          timeout: 30,
          allowedIp: '',
          remark: '系统管理员',
        },
        {
          username: 'testuser',
          userType: '普通用户',
          isActive: false,  // '关闭'
          retryLimit: 3,
          timeout: 60,
          allowedIp: '192.168.1.1',
          remark: '测试用户',
        },
      ],
      rowSelection: {
        type: 'checkbox',
      },
      pagination: {
        pageSize: 5,
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
      if (!this.addUserForm.username || !this.addUserForm.password || !this.addUserForm.confirmPassword) {
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
          this.data = this.data.filter(item => !this.selectedKeys.includes(item.username));
          this.$message.success('用户删除成功');
        },
      });
    },
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
