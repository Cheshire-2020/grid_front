<template>
  <div>
    <a-space direction="vertical" size="large" :style="{ width: '100%' }">
      <a-button type="primary" @click="handleAdd">
        <icon-plus />
        添加 POC
      </a-button>

      <a-table :columns="columns" :data="pocs" :loading="loading">
        <template #type="{ record }">
          <a-tag :color="getTypeColor(record.type)">
            {{ record.type }}
          </a-tag>
        </template>
        <template #actions="{ record }">
          <a-space>
            <a-button type="text" @click="handleEdit(record)">
              <icon-edit />
              编辑
            </a-button>
            <a-button type="text" @click="handleViewCode(record)">
              <icon-code />
              查看代码
            </a-button>
            <a-popconfirm
              content="确定删除该 POC 吗？"
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
      :title="editingId ? '编辑 POC' : '添加 POC'"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form ref="formRef" :model="form" :rules="rules">
        <a-form-item field="name" label="名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item field="type" label="类型">
          <a-select v-model="form.type">
            <a-option value="Exploit">Exploit</a-option>
            <a-option value="Scanner">Scanner</a-option>
            <a-option value="Fuzzer">Fuzzer</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="targetSystem" label="目标系统">
          <a-input v-model="form.targetSystem" />
        </a-form-item>
        <a-form-item field="description" label="描述">
          <a-textarea v-model="form.description" />
        </a-form-item>
        <a-form-item field="code" label="代码">
          <a-textarea
            v-model="form.code"
            :auto-size="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="codeVisible"
      title="POC 代码"
      @ok="codeVisible = false"
      @cancel="codeVisible = false"
    >
      <pre><code>{{ selectedCode }}</code></pre>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    IconPlus,
    IconEdit,
    IconDelete,
    IconCode,
  } from '@arco-design/web-vue/es/icon';

  interface PoCItem {
    id: string;
    name: string;
    type: 'Exploit' | 'Scanner' | 'Fuzzer';
    targetSystem: string;
    description: string;
    code: string;
  }

  export default defineComponent({
    components: {
      IconPlus,
      IconEdit,
      IconDelete,
      IconCode,
    },
    setup() {
      const pocs = ref<PoCItem[]>([]);
      const loading = ref(false);
      const visible = ref(false);
      const codeVisible = ref(false);
      const selectedCode = ref('');
      const editingId = ref<string | null>(null);
      const formRef = ref();

      const form = reactive({
        name: '',
        type: 'Exploit' as PoCItem['type'],
        targetSystem: '',
        description: '',
        code: '',
      });

      const rules = {
        name: [{ required: true, message: '请输入名称' }],
        type: [{ required: true, message: '请选择类型' }],
        targetSystem: [{ required: true, message: '请输入目标系统' }],
        code: [{ required: true, message: '请输入 POC 代码' }],
      };

      const columns = [
        { title: '名称', dataIndex: 'name' },
        { title: '类型', dataIndex: 'type', slotName: 'type' },
        { title: '目标系统', dataIndex: 'targetSystem' },
        { title: '操作', slotName: 'actions' },
      ];

      const fetchPOCs = () => {
        loading.value = true;
        // 模拟API调用
        setTimeout(() => {
          pocs.value = [
            {
              id: '1',
              name: 'SQL Injection Exploit',
              type: 'Exploit',
              targetSystem: 'Web Applications',
              description: 'A SQL injection exploit for...',
              code: 'def exploit(target):\n    # SQL injection code here\n    pass',
            },
            {
              id: '2',
              name: 'Port Scanner',
              type: 'Scanner',
              targetSystem: 'Network Devices',
              description: 'A simple port scanner...',
              code: 'def scan_ports(target):\n    # Port scanning code here\n    pass',
            },
          ];
          loading.value = false;
        }, 1000);
      };

      onMounted(() => {
        fetchPOCs();
      });

      const handleAdd = () => {
        editingId.value = null;
        Object.assign(form, {
          name: '',
          type: 'Exploit',
          targetSystem: '',
          description: '',
          code: '',
        });
        visible.value = true;
      };

      const handleEdit = (record: PoCItem) => {
        editingId.value = record.id;
        Object.assign(form, record);
        visible.value = true;
      };

      const handleDelete = (id: string) => {
        pocs.value = pocs.value.filter((item) => item.id !== id);
        Message.success('POC 删除成功');
      };

      const handleViewCode = (record: PoCItem) => {
        selectedCode.value = record.code;
        codeVisible.value = true;
      };

      const handleOk = () => {
        formRef.value?.validate((errors: any) => {
          if (!errors) {
            if (editingId.value) {
              pocs.value = pocs.value.map((item) =>
                item.id === editingId.value ? { ...item, ...form } : item
              );
              Message.success('POC 更新成功');
            } else {
              const newPOC = {
                id: Date.now().toString(),
                ...form,
              };
              pocs.value.push(newPOC);
              Message.success('POC 添加成功');
            }
            visible.value = false;
          }
        });
      };

      const handleCancel = () => {
        visible.value = false;
      };

      const getTypeColor = (type: PoCItem['type']) => {
        const colorMap = {
          Exploit: 'rgb(var(--red-6))',
          Scanner: 'rgb(var(--green-6))',
          Fuzzer: 'rgb(var(--blue-6))',
        };
        return colorMap[type];
      };

      return {
        pocs,
        loading,
        visible,
        codeVisible,
        selectedCode,
        editingId,
        form,
        rules,
        columns,
        formRef,
        handleAdd,
        handleEdit,
        handleDelete,
        handleViewCode,
        handleOk,
        handleCancel,
        getTypeColor,
      };
    },
  });
</script>
