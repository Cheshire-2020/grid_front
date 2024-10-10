<template>
  <basic-container>
    <a-space direction="vertical" size="large" :style="{ width: '100%' }">
      <a-button type="primary" @click="handleAdd">
        <icon-plus />
        添加漏洞
      </a-button>

      <a-table :columns="columns" :data="vulnerabilities" :loading="loading">
        <template #severity="{ record }">
          <a-tag :color="getSeverityColor(record.severity)">
            {{ record.severity }}
          </a-tag>
        </template>
        <template #actions="{ record }">
          <a-space>
            <a-button type="primary" @click="handleEdit(record)">
              <icon-edit />
              编辑
            </a-button>
            <a-popconfirm
              content="确定删除该漏洞吗？"
              @ok="handleDelete(record.id)"
            >
              <a-button type="primary" status="danger">
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
      :title="editingId ? '编辑漏洞' : '添加漏洞'"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form ref="formRef" :model="form" :rules="rules">
        <a-form-item field="name" label="名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item field="cveId" label="CVE ID">
          <a-input v-model="form.cveId" />
        </a-form-item>
        <a-form-item field="severity" label="严重程度">
          <a-select v-model="form.severity">
            <a-option value="Critical">严重</a-option>
            <a-option value="High">高危</a-option>
            <a-option value="Medium">中危</a-option>
            <a-option value="Low">低危</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="affectedSystems" label="受影响系统">
          <a-input v-model="form.affectedSystems" />
        </a-form-item>
        <a-form-item field="description" label="描述">
          <a-textarea v-model="form.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </basic-container>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';
  import BasicContainer from '@/layout/basic-container.vue';

  interface VulnerabilityItem {
    id: string;
    name: string;
    cveId: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    affectedSystems: string;
    description: string;
  }

  export default defineComponent({
    components: {
      BasicContainer,
      IconPlus,
      IconEdit,
      IconDelete,
    },
    setup() {
      const vulnerabilities = ref<VulnerabilityItem[]>([]);
      const loading = ref(false);
      const visible = ref(false);
      const editingId = ref<string | null>(null);
      const formRef = ref();

      const form = reactive({
        name: '',
        cveId: '',
        severity: 'Medium' as VulnerabilityItem['severity'],
        affectedSystems: '',
        description: '',
      });

      const rules = {
        name: [{ required: true, message: '请输入名称' }],
        cveId: [{ required: true, message: '请输入 CVE ID' }],
        severity: [{ required: true, message: '请选择严重程度' }],
        affectedSystems: [{ required: true, message: '请输入受影响系统' }],
      };

      const columns = [
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: 'CVE ID',
          dataIndex: 'cveId',
        },
        {
          title: '严重程度',
          dataIndex: 'severity',
          slotName: 'severity',
        },
        {
          title: '受影响系统',
          dataIndex: 'affectedSystems',
        },
        {
          title: '操作',
          slotName: 'actions',
        },
      ];

      const fetchVulnerabilities = () => {
        loading.value = true;
        // 模拟API调用
        setTimeout(() => {
          vulnerabilities.value = [
            {
              id: '1',
              name: 'Log4Shell',
              cveId: 'CVE-2021-44228',
              severity: 'Critical',
              affectedSystems: 'Java applications using Log4j 2',
              description: 'A critical vulnerability in Log4j...',
            },
            {
              id: '2',
              name: 'Heartbleed',
              cveId: 'CVE-2014-0160',
              severity: 'High',
              affectedSystems: 'OpenSSL',
              description:
                'A serious vulnerability in the OpenSSL cryptographic software library...',
            },
          ];
          loading.value = false;
        }, 1000);
      };

      onMounted(() => {
        fetchVulnerabilities();
      });

      const handleAdd = () => {
        editingId.value = null;
        Object.assign(form, {
          name: '',
          cveId: '',
          severity: 'Medium',
          affectedSystems: '',
          description: '',
        });
        visible.value = true;
      };

      const handleEdit = (record: VulnerabilityItem) => {
        editingId.value = record.id;
        Object.assign(form, record);
        visible.value = true;
      };

      const handleDelete = (id: string) => {
        vulnerabilities.value = vulnerabilities.value.filter(
          (item) => item.id !== id
        );
        Message.success('漏洞删除成功');
      };

      const handleOk = () => {
        formRef.value?.validate((errors) => {
          if (!errors) {
            if (editingId.value) {
              vulnerabilities.value = vulnerabilities.value.map((item) =>
                item.id === editingId.value ? { ...item, ...form } : item
              );
              Message.success('漏洞更新成功');
            } else {
              const newVulnerability = {
                id: Date.now().toString(),
                ...form,
              };
              vulnerabilities.value.push(newVulnerability);
              Message.success('漏洞添加成功');
            }
            visible.value = false;
          }
        });
      };

      const handleCancel = () => {
        visible.value = false;
      };

      const getSeverityColor = (severity: VulnerabilityItem['severity']) => {
        const colorMap = {
          Critical: 'rgb(var(--red-6))',
          High: 'rgb(var(--orange-6))',
          Medium: 'rgb(var(--yellow-6))',
          Low: 'rgb(var(--blue-6))',
        };
        return colorMap[severity];
      };

      return {
        vulnerabilities,
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
        getSeverityColor,
      };
    },
  });
</script>
