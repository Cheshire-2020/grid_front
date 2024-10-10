<template>
  <div>
    <a-space direction="vertical" size="large" :style="{ width: '100%' }">
      <a-button type="primary" @click="handleAdd">
        <icon-plus />
        添加指纹
      </a-button>

      <a-table :columns="columns" :data="fingerprints" :loading="loading">
        <template #actions="{ record }">
          <a-space>
            <a-button type="text" @click="handleEdit(record)">
              <icon-edit />
              编辑
            </a-button>
            <a-popconfirm
              content="确定删除该指纹吗？"
              @ok="handleDelete(record.id)"
            >
              <a-button type="text" status="danger">
                <icon-delete />
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-space>

    <a-modal
      v-model:visible="visible"
      :title="editingId ? '编辑指纹' : '添加指纹'"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form ref="formRef" :model="form" :rules="rules">
        <a-form-item field="name" label="名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item field="type" label="类型">
          <a-select v-model="form.type">
            <a-option value="Web Server">Web Server</a-option>
            <a-option value="Database">Database</a-option>
            <a-option value="Operating System">Operating System</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="description" label="描述">
          <a-textarea v-model="form.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';

  interface FingerprintItem {
    id: string;
    name: string;
    type: string;
    description: string;
  }

  export default defineComponent({
    components: {
      IconPlus,
      IconEdit,
      IconDelete,
    },
    setup() {
      const fingerprints = ref<FingerprintItem[]>([]);
      const loading = ref(false);
      const visible = ref(false);
      const editingId = ref<string | null>(null);
      const formRef = ref();

      const form = reactive({
        name: '',
        type: '',
        description: '',
      });

      const rules = {
        name: [{ required: true, message: '请输入名称' }],
        type: [{ required: true, message: '请选择类型' }],
      };

      const columns = [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '类型',
          dataIndex: 'type',
        },
        {
          title: '描述',
          dataIndex: 'description',
        },
        {
          title: '操作',
          slotName: 'actions',
        },
      ];

      const fetchFingerprints = () => {
        loading.value = true;
        // 模拟API调用
        setTimeout(() => {
          fingerprints.value = [
            {
              id: '1',
              name: 'Apache',
              type: 'Web Server',
              description: 'Apache HTTP Server',
            },
            {
              id: '2',
              name: 'Nginx',
              type: 'Web Server',
              description: 'Nginx Web Server',
            },
          ];
          loading.value = false;
        }, 1000);
      };

      onMounted(() => {
        fetchFingerprints();
      });

      const handleAdd = () => {
        editingId.value = null;
        Object.assign(form, { name: '', type: '', description: '' });
        visible.value = true;
      };

      const handleEdit = (record: FingerprintItem) => {
        editingId.value = record.id;
        Object.assign(form, record);
        visible.value = true;
      };

      const handleDelete = (id: string) => {
        fingerprints.value = fingerprints.value.filter(
          (item) => item.id !== id
        );
        Message.success('指纹删除成功');
      };

      const handleOk = () => {
        formRef.value?.validate((errors) => {
          if (!errors) {
            if (editingId.value) {
              fingerprints.value = fingerprints.value.map((item) =>
                item.id === editingId.value ? { ...item, ...form } : item
              );
              Message.success('指纹更新成功');
            } else {
              const newFingerprint = {
                id: Date.now().toString(),
                ...form,
              };
              fingerprints.value.push(newFingerprint);
              Message.success('指纹添加成功');
            }
            visible.value = false;
          }
        });
      };

      const handleCancel = () => {
        visible.value = false;
      };

      return {
        fingerprints,
        loading,
        visible,
        editingId,
        form,
        rules,
        columns,
        formRef,
        handleAdd,
        handleEdit,
        handleDelete,
        handleOk,
        handleCancel,
      };
    },
  });
</script>
