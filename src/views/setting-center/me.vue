<template>
  <basic-container>
    <!-- User Info Descriptions -->
    <a-descriptions
      style="margin-top: 20px"
      title="个人中心"
      :column="1"
      bordered
    >
      <a-descriptions-item label="用户名">{{
        userInfo.username
      }}</a-descriptions-item>
      <a-descriptions-item label="手机号码">{{
        userInfo.phone
      }}</a-descriptions-item>
      <a-descriptions-item label="邮箱地址">{{
        userInfo.email
      }}</a-descriptions-item>
      <a-descriptions-item label="部门">{{
        userInfo.department
      }}</a-descriptions-item>
    </a-descriptions>

    <!-- Action Buttons -->
    <p></p>
    <a-space>
      <a-button type="primary" @click="showEditUserModal">编辑</a-button>
      <a-button type="primary" status="danger" @click="showUpdateKeyModal"
        >更改密码
      </a-button>
    </a-space>

    <!-- Edit User Modal -->
    <a-modal
      v-model:visible="isEditUserModalVisible"
      title="编辑用户信息"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleEditUser"
      @cancel="closeEditUserModal"
    >
      <a-form
        :model="userInfo"
        label-col="{ span: 6 }"
        wrapper-col="{ span: 14 }"
      >
        <a-form-item label="用户名">
          <a-input v-model="userInfo.username" disabled />
        </a-form-item>
        <a-form-item label="手机号码">
          <a-input v-model="userInfo.phone" />
        </a-form-item>
        <a-form-item label="邮箱地址">
          <a-input v-model="userInfo.email" />
        </a-form-item>
        <a-form-item label="部门">
          <a-input v-model="userInfo.department" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Update Password Modal -->
    <a-modal
      v-model:visible="isUpdateKeyModalVisible"
      title="更改密码"
      @ok="handleUpdatePassword"
      @cancel="closeUpdateKeyModal"
    >
      <a-form
        :model="updatePasswordForm"
        label-col="{ span: 6 }"
        wrapper-col="{ span: 14 }"
      >
        <a-form-item label="旧密码" required>
          <a-input-password
            v-model="updatePasswordForm.oldPassword"
            placeholder="请输入旧密码"
          />
        </a-form-item>
        <a-form-item label="新密码" required>
          <a-input-password
            v-model="updatePasswordForm.newPassword"
            placeholder="请输入新密码"
          />
        </a-form-item>
        <a-form-item label="确认密码" required>
          <a-input-password
            v-model="updatePasswordForm.confirmPassword"
            placeholder="请再次输入新密码"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </basic-container>
</template>

<script>
  import { ref, reactive } from 'vue';
  import BasicContainer from '@/layout/basic-container.vue';

  export default {
    components: { BasicContainer },
    setup() {
      // User info for display and editing
      const userInfo = reactive({
        username: 'Socrates',
        phone: '123-1234-1234',
        email: 'ry@qq.com',
        department: '研发部门',
      });

      // Password update form
      const updatePasswordForm = reactive({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      const isEditUserModalVisible = ref(false);
      const isUpdateKeyModalVisible = ref(false);

      // Show the edit user modal
      const showEditUserModal = () => {
        isEditUserModalVisible.value = true;
      };

      // Close the edit user modal
      const closeEditUserModal = () => {
        isEditUserModalVisible.value = false;
      };

      // Handle user info editing
      const handleEditUser = () => {
        // Perform save logic for user info here
        closeEditUserModal();
        this.$message.success('用户信息已更新');
      };

      // Show update password modal
      const showUpdateKeyModal = () => {
        isUpdateKeyModalVisible.value = true;
      };

      // Close update password modal
      const closeUpdateKeyModal = () => {
        isUpdateKeyModalVisible.value = false;
        updatePasswordForm.oldPassword = '';
        updatePasswordForm.newPassword = '';
        updatePasswordForm.confirmPassword = '';
      };

      // Handle password update
      const handleUpdatePassword = () => {
        if (
          updatePasswordForm.newPassword !== updatePasswordForm.confirmPassword
        ) {
          this.$message.error('新密码与确认密码不一致');
          return;
        }
        // Handle password update logic here
        closeUpdateKeyModal();
        this.$message.success('密码更改成功');
      };

      return {
        userInfo,
        updatePasswordForm,
        isEditUserModalVisible,
        isUpdateKeyModalVisible,
        showEditUserModal,
        closeEditUserModal,
        handleEditUser,
        showUpdateKeyModal,
        closeUpdateKeyModal,
        handleUpdatePassword,
      };
    },
  };
</script>

<style scoped lang="less">
  /* Add your styles here if needed */
</style>
