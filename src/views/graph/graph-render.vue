<template>
  <div style="height: 100%">
    <D3GraphRenderJanusgraph
      ref="childRef"
      container-id="layout-content"
      session-key-of-nodes="nodes_janus"
      session-key-of-edges="edges_janus"
    ></D3GraphRenderJanusgraph>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { saveSessionAttr } from '@/utils/session_loader';
  import D3GraphRenderJanusgraph from '@/components/graph-box/D3GraphRenderJanusgraph.vue';
  import { formatResultForMysqlGraph } from '@/utils/janus_graph_formatter';
  import axios from 'axios';

  const childRef = ref(null);

  const nodeDataMysql = ref([]);
  const edgeDataMysql = ref([]);

  onMounted(() => {
    axios.get('http://localhost:8080/allgraph').then((res) => {
      const { node, edge } = formatResultForMysqlGraph(
        res.data.nodes,
        res.data.edges
      );
      saveSessionAttr('nodes_janus', node);
      saveSessionAttr('edges_janus', edge);
      childRef.value.init(node, edge);
    });
  });
</script>

<style scoped lang="less"></style>
