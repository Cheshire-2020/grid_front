<template>
  <div>
    <a-space direction="vertical" size="large" :style="{ width: '100%' }">
      <a-row justify="space-between">
        <a-col>
          <a-button type="primary" @click="handleAdd">
            <icon-plus />
            添加位置
          </a-button>
        </a-col>
        <a-col>
          <a-input-search
            v-model="searchKeyword"
            placeholder="搜索位置"
            style="width: 300px"
            @search="handleSearch"
          />
        </a-col>
      </a-row>

      <a-table :columns="columns" :data="filteredLocations" :loading="loading">
        <template #status="{ record }">
          <a-tag :color="record.active ? 'green' : 'red'">
            {{ record.active ? '活跃' : '不活跃' }}
          </a-tag>
        </template>
        <template #actions="{ record }">
          <a-space>
            <a-button type="text" @click="handleEdit(record)">
              <icon-edit />
              编辑
            </a-button>
            <a-popconfirm
              content="确定删除该位置吗？"
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
      :title="editingId ? '编辑位置' : '添加位置'"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form ref="formRef" :model="form" :rules="rules">
        <a-form-item field="name" label="名称">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item field="latitude" label="纬度">
          <a-input-number v-model="form.latitude" :precision="6" />
        </a-form-item>
        <a-form-item field="longitude" label="经度">
          <a-input-number v-model="form.longitude" :precision="6" />
        </a-form-item>
        <a-form-item field="address" label="地址">
          <a-textarea v-model="form.address" />
        </a-form-item>
        <a-form-item field="active" label="状态">
          <a-switch v-model="form.active" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon';

  interface LocationItem {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    active: boolean;
  }

  export default defineComponent({
    components: {
      IconPlus,
      IconEdit,
      IconDelete,
    },
    setup() {
      const locations = ref<LocationItem[]>([]);
      const loading = ref(false);
      const visible = ref(false);
      const editingId = ref<string | null>(null);
      const formRef = ref();
      const searchKeyword = ref('');

      const form = reactive({
        name: '',
        latitude: 0,
        longitude: 0,
        address: '',
        active: true,
      });

      const rules = {
        name: [{ required: true, message: '请输入位置名称' }],
        latitude: [{ required: true, message: '请输入纬度' }],
        longitude: [{ required: true, message: '请输入经度' }],
        address: [{ required: true, message: '请输入地址' }],
      };

      const columns = [
        { title: '名称', dataIndex: 'name' },
        { title: '纬度', dataIndex: 'latitude' },
        { title: '经度', dataIndex: 'longitude' },
        { title: '地址', dataIndex: 'address' },
        { title: '状态', dataIndex: 'active', slotName: 'status' },
        { title: '操作', slotName: 'actions' },
      ];

      const filteredLocations = computed(() => {
        if (!searchKeyword.value) return locations.value;
        return locations.value.filter(
          (location) =>
            location.name
              .toLowerCase()
              .includes(searchKeyword.value.toLowerCase()) ||
            location.address
              .toLowerCase()
              .includes(searchKeyword.value.toLowerCase())
        );
      });

      const fetchLocations = () => {
        loading.value = true;
        // 模拟API调用
        setTimeout(() => {
          locations.value = [
            {
              id: '1',
              name: '北京办公室',
              latitude: 39.9042,
              longitude: 116.4074,
              address: '北京市朝阳区xxx街道',
              active: true,
            },
            {
              id: '2',
              name: '上海分部',
              latitude: 31.2304,
              longitude: 121.4737,
              address: '上海市浦东新区xxx路',
              active: true,
            },
            {
              id: '3',
              name: '广州仓库',
              latitude: 23.1291,
              longitude: 113.2644,
              address: '广州市白云区xxx工业园',
              active: false,
            },
          ];
          loading.value = false;
        }, 1000);
      };

      onMounted(() => {
        fetchLocations();
      });

      const handleAdd = () => {
        editingId.value = null;
        Object.assign(form, {
          name: '',
          latitude: 0,
          longitude: 0,
          address: '',
          active: true,
        });
        visible.value = true;
      };

      const handleEdit = (record: LocationItem) => {
        editingId.value = record.id;
        Object.assign(form, record);
        visible.value = true;
      };

      const handleDelete = (id: string) => {
        locations.value = locations.value.filter((item) => item.id !== id);
        Message.success('位置删除成功');
      };

      const handleOk = () => {
        formRef.value?.validate((errors: any) => {
          if (!errors) {
            if (editingId.value) {
              locations.value = locations.value.map((item) =>
                item.id === editingId.value ? { ...item, ...form } : item
              );
              Message.success('位置更新成功');
            } else {
              const newLocation = {
                id: Date.now().toString(),
                ...form,
              };
              locations.value.push(newLocation);
              Message.success('位置添加成功');
            }
            visible.value = false;
          }
        });
      };

      const handleCancel = () => {
        visible.value = false;
      };

      const handleSearch = () => {
        // 这里可以添加额外的搜索逻辑，如果需要的话
        console.log('Searching for:', searchKeyword.value);
      };

      return {
        locations,
        filteredLocations,
        loading,
        visible,
        editingId,
        form,
        rules,
        columns,
        formRef,
        searchKeyword,
        handleAdd,
        handleEdit,
        handleDelete,
        handleOk,
        handleCancel,
        handleSearch,
      };
    },
  });
</script>
