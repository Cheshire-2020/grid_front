<template>
  <div style="height: 100%">
    <d3-graph-render-janusgraph
      ref="childRef"
      container-id="layout-content"
      session-key-of-nodes="nodes_janus"
      session-key-of-edges="edges_janus"
    ></d3-graph-render-janusgraph>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { nodes, edges } from '@/mock/mock-graph';
  import { saveSessionAttr } from '@/utils/session_loader';
  import D3GraphRenderJanusgraph from '@/components/graph-box/D3GraphRenderJanusgraph.vue';
  import formatResultForJanusGraph from '@/utils/janus_graph_formatter';

  const nodeData = ref([]);
  const edgeData = ref([]);

  const childRef = ref(null);

  onMounted(() => {
    const res = formatResultForJanusGraph(nodes(), edges());
    nodeData.value = res.node;
    edgeData.value = res.edge;
    saveSessionAttr('nodes_janus', nodeData.value);
    saveSessionAttr('edges_janus', edgeData.value);
    childRef.value.init(nodeData.value, edgeData.value);
  });
</script>

<style scoped lang="less"></style>
