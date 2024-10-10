<template>
  <div class="container">
    <div class="full-height-panel-container">
      <a-radio-group type="button" v-model="size">
        <a-radio value="mini">mini</a-radio>
        <a-radio value="small">small</a-radio>
        <a-radio value="medium">medium</a-radio>
        <a-radio value="large">large</a-radio>
      </a-radio-group>
      <p></p>
      <a-descriptions
        style="margin-top: 20px"
        :data="data"
        :size="size"
        title="个人中心"
        :column="1"
      />
      <p></p>

      <a-space>
        <a-button type="primary" @click="editUser">编辑</a-button>
        <a-button type="primary" status="danger" @click="showUpdateKeyModal"
          >更改密码</a-button
        >
      </a-space>

      <a-modal
        v-model:visible="isUpdateKeyModalVisible"
        title="更改密码"
        @ok="handleUpdatePassword"
        @cancel="closeUpdateKeyModal"
      >
        <a-form ref="updatePasswordForm" :model="updatePasswordForm">
          <a-form-item label="旧密码" required>
            <a-input
              v-model="updatePasswordForm.oldPassword"
              placeholder="请输入旧密码"
              type="password"
            />
          </a-form-item>
          <a-form-item label="新密码" required>
            <a-input
              v-model="updatePasswordForm.newPassword"
              placeholder="请输入新密码"
              type="password"
            />
          </a-form-item>
          <a-form-item label="确认密码" required>
            <a-input
              v-model="updatePasswordForm.confirmPassword"
              placeholder="再次输入新密码"
              type="password"
            />
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
      const size = ref('medium');
      const isUpdateKeyModalVisible = ref(false);

      const data = ref([
        { label: '用户名', value: 'Socrates' },
        { label: '手机号码', value: '123-1234-1234' },
        { label: '邮箱地址', value: 'ry@qq.com' },
        { label: '部门', value: '研发部门' },
      ]);

      const updatePasswordForm = ref({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      const showUpdateKeyModal = () => {
        isUpdateKeyModalVisible.value = true;
      };

      const closeUpdateKeyModal = () => {
        isUpdateKeyModalVisible.value = false;
        updatePasswordForm.value.newPassword = '';
        updatePasswordForm.value.confirmPassword = '';
      };

      const handleUpdatePassword = () => {
        if (
          updatePasswordForm.value.newPassword !==
          updatePasswordForm.value.confirmPassword
        ) {
          this.$message.error('密码和确认密码不一致');
          return;
        }
        // Handle password update logic here
        this.$message.success('密码更改成功');
        closeUpdateKeyModal();
      };

      const editUser = () => {
        // Implement user editing logic here
        this.$message.info('编辑用户功能未实现');
      };

      return {
        data,
        size,
        isUpdateKeyModalVisible,
        updatePasswordForm,
        showUpdateKeyModal,
        closeUpdateKeyModal,
        handleUpdatePassword,
        editUser,
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
