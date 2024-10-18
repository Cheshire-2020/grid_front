<template>
  <basic-container>
    <a-space>
      <a-button type="primary" @click="showAddNodeModal">新增</a-button>
      <a-button
        type="primary"
        status="danger"
        :disabled="selectedKeys.length === 0"
        @click="bulkDelete"
        >批量删除选中项
      </a-button>
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="请输入节点组名"
        button-text="搜索"
        search-button
        @search="searchNodename"
      />
    </a-space>

    <p></p>

    <!-- User Table -->
    <a-space direction="vertical" size="large" fill>
      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="Nodename"
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
              content="确定删除该节点组吗？"
              @ok="handleDelete(record.Nodename)"
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
      title="新增节点组"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleAddOrEditUser"
      @cancel="closeAddUserModal"
    >
      <a-form :model="addUserForm">
        <a-form-item label="节点组名" required>
          <a-input
            v-model="addUserForm.Nodename"
            placeholder="请输入节点组名称"
          />
        </a-form-item>
        <a-form-item label="输入方式">
          <a-radio-group v-model="addUserForm.inputType">
            <a-radio value="IP段">输入IP段</a-radio>
            <a-radio value="文件导入">文件导入</a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 如果选择文件导入，显示文件上传项 -->
        <a-form-item
          v-if="addUserForm.inputType === '文件导入'"
          label="导入文件"
        >
          <a-space direction="vertical" :style="{ width: '100%' }">
            <a-upload
              action="/"
              :before-upload="handleFileBeforeUpload"
              :file-list="fileList"
              :on-remove="handleFileRemove"
            />
          </a-space>
          <!--          <a-upload
            :before-upload="handleFileBeforeUpload"
            :file-list="fileList"
            :on-remove="handleFileRemove"
          >
            <a-button icon="upload">点击上传</a-button>
          </a-upload>-->
        </a-form-item>
        <a-form-item v-if="addUserForm.inputType === 'IP段'" label="IP段">
          <a-textarea
            v-model="addUserForm.ipRange"
            placeholder="请输入多个IP段，用换行分隔"
            rows="4"
          />
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
  import * as XLSX from 'xlsx';

  export default {
    components: { BasicContainer },
    setup() {
      const selectedKeys = ref([]);
      const isAddUserModalVisible = ref(false);
      const editMode = ref(false); // 用于区分新增和编辑模式
      const fileList = ref([]);

      // 响应式表单数据
      const addUserForm = reactive({
        Nodename: '',
        inputType: 'IP段', // 默认输入方式为IP段
        ipRange: '',
        remark: '',
      });

      const searchKeyword = ref(''); // 搜索关键字

      const data = ref([
        { Nodename: '组1', ipRange: '192.168.1.1', remark: '' },
        { Nodename: '组2', ipRange: '10.0.0.1', remark: '' },
      ]);

      const columns = reactive([
        { title: '节点组名称', dataIndex: 'Nodename', key: 'Nodename' },
        { title: 'IP段', dataIndex: 'ipRange', key: 'ipRange' },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '操作', slotName: 'optional' },
      ]);

      // 基于搜索关键字过滤数据
      const filteredData = computed(() => {
        if (!searchKeyword.value) return data.value;
        return data.value.filter((item) =>
          item.Nodename.includes(searchKeyword.value)
        );
      });

      // 重置表单数据
      const resetForm = () => {
        addUserForm.Nodename = '';
        addUserForm.inputType = 'IP段';
        addUserForm.ipRange = '';
        addUserForm.remark = '';
        fileList.value = [];
      };

      // 显示新增节点组弹窗
      const showAddNodeModal = () => {
        resetForm();
        editMode.value = false; // 新增用户时，编辑模式为false
        isAddUserModalVisible.value = true;
      };

      // 处理文件上传
      const handleFileUpload = (file) => {
        fileList.value.push(file);
        return false; // 阻止自动上传
      };

      const handleFileBeforeUpload = (file) => {
        const isExcel =
          file.type === 'application/vnd.ms-excel' ||
          file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const isLt2M = file.size / 1024 / 1024 < 2; // 限制文件大小小于 2MB

        if (!isExcel) {
          message.error('只能上传 Excel 文件！');
          return false; // 阻止上传
        }

        if (!isLt2M) {
          message.error('上传的文件大小不能超过 2MB！');
          return false; // 阻止上传
        }

        // 使用 FileReader 读取 Excel 文件
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const excelData = e.target.result;
            const workbook = XLSX.read(excelData, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // 解析 Excel 数据，假设 IP 段或 IP 地址在每行的第一列
            const ipRangeData = jsonData.map((row) => row[0]).filter(Boolean);

            if (ipRangeData.length > 0) {
              addUserForm.ipRange = ipRangeData.join('\n'); // 将 IP 段数据转换为文本，换行分隔
            } else {
              message.error('Excel 文件中没有有效的 IP 段数据');
            }
          } catch (error) {
            console.error('文件解析错误:', error);
            message.error('文件解析失败，请检查文件格式');
          }
        };

        reader.readAsBinaryString(file);
        return false; // 阻止自动上传
      };

      // 处理文件删除
      const handleFileRemove = (file) => {
        fileList.value = fileList.value.filter((item) => item.uid !== file.uid);
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
        if (
          !addUserForm.Nodename ||
          (addUserForm.inputType === 'IP段' && !addUserForm.ipRange)
        ) {
          message.error('请填写所有必填字段');
          return;
        }

        if (editMode.value) {
          // 编辑模式，找到并更新数据
          const userIndex = data.value.findIndex(
            (user) => user.Nodename === addUserForm.Nodename
          );
          if (userIndex !== -1) {
            data.value[userIndex] = { ...addUserForm }; // 更新用户信息
            message.success('节点组更新成功');
          }
        } else {
          // 新增用户
          data.value.push({ ...addUserForm });
          message.success('节点组新增成功');
        }

        closeAddUserModal();
      };

      // 删除用户
      const handleDelete = (Nodename) => {
        Modal.confirm({
          title: '确认删除',
          content: `你确定要删除节点组 ${Nodename} 吗？`,
          onOk: () => {
            data.value = data.value.filter(
              (item) => item.Nodename !== Nodename
            );
            message.success(`用户 ${Nodename} 已删除`);
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
          content: '你确定要删除选中的节点组吗？',
          onOk: () => {
            data.value = data.value.filter(
              (item) => !selectedKeys.value.includes(item.Nodename)
            );
            selectedKeys.value = [];
            message.success('该节点组删除成功');
          },
        });
      };

      // 搜索节点组
      const searchNodename = (value) => {
        searchKeyword.value = value.trim();
      };

      return {
        selectedKeys,
        isAddUserModalVisible,
        addUserForm,
        data,
        columns,
        filteredData,
        searchNodename,
        showAddNodeModal,
        closeAddUserModal,
        handleDelete,
        bulkDelete,
        handleEdit,
        handleAddOrEditUser,
        fileList,
        handleFileUpload,
        handleFileBeforeUpload,
        handleFileRemove,
      };
    },
  };
</script>

<style scoped lang="less"></style>
