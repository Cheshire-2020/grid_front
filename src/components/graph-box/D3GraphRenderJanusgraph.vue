<template>
  <div class="container">
    <div id="d3-graph-render-container" class="d3-graph-render-container">
    </div>
  </div>
</template>

<script setup>
  import * as d3 from 'd3';
  import { loadSessionAttr, saveSessionAttr } from '@/utils/session_loader';
  import { ref } from 'vue';

  const isSuccess = ref(false);
  const d3Nodes = ref([]);
  const d3Links = ref([]);

  const props = defineProps({
    containerId: Number,
    sessionKeyOfNodes: String,
    sessionKeyOfEdges: String,
  });

  const onNodeClick = (nodeId) => {
    const currentClickNodes = {
      node: {},
      neighbours: [],
      pathToNeighbours: [],
    };

    const nodes = loadSessionAttr(props.sessionKeyOfNodes);
    const links = loadSessionAttr(props.sessionKeyOfEdges);

    nodes.forEach((item) => {
      if (item.id === nodeId) {
        currentClickNodes.node = item;
      }
    });

    links.forEach((item) => {
      if (item.source === nodeId || item.target === nodeId) {
        currentClickNodes.neighbours.push(item);
      }
    });

    links.forEach((item) => {
      if (item.source === nodeId) {
        currentClickNodes.pathToNeighbours.push(
          ...nodes.filter((node) => node.id === item.target)
        );
      } else if (item.target === nodeId) {
        currentClickNodes.pathToNeighbours.push(
          ...nodes.filter((node) => node.id === item.source)
        );
      }
    });

    this.$emit('nodeClick', currentClickNodes);
  };

  const onNodeHover = (nodeId) => {
    const links = loadSessionAttr(props.sessionKeyOfEdges);
    // 邻居高亮
    links.forEach((item) => {
      if (item.source === nodeId) {
        d3.selectAll(`#node_${item.target}`).attr(
          'class',
          'node node-selected'
        );
      } else if (item.target === nodeId) {
        d3.selectAll(`#node_${item.source}`).attr(
          'class',
          'node node-selected'
        );
      }
    });
    // 对应路径高亮
    links.forEach((item) => {
      if (item.source === nodeId) {
        d3.selectAll(`#link_${item.source}_${item.target}`).attr(
          'class',
          'link link-selected'
        );
        d3.selectAll(`#link_${item.target}_${item.source}`).attr(
          'class',
          'link link-selected'
        );
      } else if (item.target === nodeId) {
        d3.selectAll(`#link_${item.source}_${item.target}`).attr(
          'class',
          'link link-selected'
        );
        d3.selectAll(`#link_${item.target}_${item.source}`).attr(
          'class',
          'link link-selected'
        );
      }
    });
  };

  const onLinkClick = (link) => {
    this.$emit('linkClick', link);
  };

  const onLinkHover = (sourceNodeId, targetNodeId, linkType) => {
    // 连线两端高亮
    d3.selectAll(`#node_${sourceNodeId}`).attr('class', 'node node-selected');
    d3.selectAll(`#node_${targetNodeId}`).attr('class', 'node node-selected');

    this.$emit('onLinkHover', {
      sourceNodeId,
      targetNodeId,
      linkType,
    });
  };

  const onNodeDisHover = () => {
    d3.selectAll('circle').attr('class', 'node');
    d3.selectAll('line').attr('class', 'link');
  };

  const onLinkDisHover = () => {
    d3.selectAll('circle').attr('class', 'node');
  };

  const drag = (simulation) => {
    const dragStart = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragEnd = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.5);
      d.fx = null;
      d.fy = null;
    };

    const fixNodes = (exceptNode) => {
      d3Links.value.forEach((item) => {
        if (exceptNode !== item) {
          item.fx = item.x;
          item.fy = item.y;
        }
      });
    };

    const dragging = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;

      fixNodes(d);
    };

    return d3.drag().on('start', dragStart).on('drag', dragging);
  };

  const colorOfNode = (nodes) => {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return (d) => scale(d.group);
  };

  const lockGraph = () => {
    const simulation = d3.forceSimulation(d3Nodes.value);
    const lockedNodes = d3Nodes.value;
    lockedNodes.forEach((node) => {
      node.fx = node.x;
      node.fy = node.y;
    });
    simulation.nodes(lockedNodes);
  };

  const unlockGraph = () => {
    const simulation = d3.forceSimulation(d3Nodes.value);
    const lockedNodes = d3Nodes.value;
    lockedNodes.forEach((node) => {
      delete node.fx;
      delete node.fy;
    });
    simulation.nodes(lockedNodes);
  };

  const init = (nodes, links) => {
    console.log(nodes);
    console.log(links);
    console.log('===================================');
    isSuccess.value = false;
    saveSessionAttr(props.sessionKeyOfNodes, nodes);
    saveSessionAttr(props.sessionKeyOfEdges, links);

    const containersId = props.containerId;
    const containersWidth = document.getElementById(containersId).clientWidth;
    const containersHeight = document.getElementById(containersId).clientHeight;
    document.getElementById('d3-graph-render-container').style.width = `${
      containersWidth - 10
    }px`;
    document.getElementById('d3-graph-render-container').style.height = `${
      containersHeight - 10
    }px`;

    const height = document.getElementById(
      'd3-graph-render-container'
    ).clientHeight;
    const width = document.getElementById(
      'd3-graph-render-container'
    ).clientWidth;

    d3Nodes.value = nodes.map((d) => Object.create(d));
    d3Links.value = links.map((d) => Object.create(d));

    const simulation = d3
      .forceSimulation(d3Nodes.value)
      .force(
        'link',
        d3.forceLink(d3Links.value).id((d) => d.id)
      )
      .force('collide', d3.forceCollide(40))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // 创建容器
    const container = d3
      .select('.d3-graph-render-container')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .attr('id', 'd3-container')
      .call(
        d3.zoom().on('zoom', () => {
          // eslint-disable-next-line no-use-before-define
          g.attr('transform', d3.event.transform);
        })
      );

    // 创建子容器，便于整图的缩放和拖动
    const g = container.append('g').attr('class', 'graph-render-content');

    const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

    const link = g
      .append('g')
      .attr('fill', 'none')
      // 透明度
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(d3Links.value, (d) => {
        if (typeof d.source === 'object') {
          return `${d.source.id}_${d.relationship}_${d.target.id}`;
        }
        return `${d.source}_${d.relationship}_${d.target}`;
      })
      .join('line')
      .attr('id', (d) => {
        return `link_${d.source.id}_${d.target.id}`;
      })
      // 边的颜色
      .attr('stroke', (d) => {
        return colorScale(d.label);
      })
      .on('click', (d) => {
        // eslint-disable-next-line no-proto
        const source = d.source.__proto__.name;
        // eslint-disable-next-line no-proto
        const target = d.target.__proto__.name;
        // eslint-disable-next-line no-proto
        const { desc } = d.__proto__;
        // eslint-disable-next-line no-proto
        const { label } = d.__proto__;
        const currentLink = {
          source,
          target,
          desc,
          label,
        };
        onLinkClick(currentLink);
      })
      .on('mouseover', (d) => {
        onLinkHover(d.source.id, d.target.id, d.label);
      })
      .on('mouseout', () => {
        onLinkDisHover();
      })
      // 连线宽度可由数据给出，此项目暂时不用
      // .attr("stroke-width", d => Math.sqrt(d.value))
      .attr('stroke-width', 10)
      .attr('class', 'link');

    // 开始创建点
    const node = g
      .append('g')
      .attr('stroke', '#ececec')
      // 透明度
      .attr('stroke-opacity', 0.8)
      // 描线宽度
      .attr('stroke-width', 2)
      .selectAll('circle')
      .data(d3Nodes.value)
      .join('circle')
      // 半径
      .attr('r', 30)
      // 节点颜色
      .attr('fill', colorOfNode(nodes))
      // 拖动的时候的事件
      .call(drag(simulation))
      // 指定class和id
      .attr('class', 'node')
      .attr('id', (d) => `node_${d.id}`)
      // 点击的事件
      .on('click', (d) => {
        lockGraph();
        onNodeClick(d.id);
      })
      // 鼠标悬浮的事件
      .on('mouseover', (d) => {
        onNodeHover(d.id);
      })
      // 鼠标取消悬浮的事件
      .on('mouseout', () => {
        onNodeDisHover();
      });

    // 节点的名称
    node.append('title').text((d) => d.name);

    // 开始创建节点的标签
    const nodeNameText = g
      .append('g')
      .selectAll('text')
      .data(d3Nodes.value)
      .join('text')
      .text((d) => {
        // todo 不应该这么粗暴
        if (d.name.toString().length < 5) {
          return d.name;
        }
        return `${d.name.toString().slice(0, 3)}...`;
      })
      // 标签坐标以节点所在位置为准
      .attr('dx', function () {
        return (this.getBoundingClientRect().width / 2) * -1;
      })
      .attr('dy', function () {
        return (this.getBoundingClientRect().height / 2) * -1 + 15;
      })
      .attr('id', (d) => `text_${d.id}`)
      .attr('class', 'nodeName');

    // 动态的力仿真
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

      nodeNameText.attr('x', (d) => d.x).attr('y', (d) => d.y);
    });

    isSuccess.value = true;
  };

  defineExpose({
    init,
  });
</script>

<style>
  .d3-graph-render-container {
    border-radius: 8px;
    overflow: hidden;
    background: white;
  }

  .link:hover {
    stroke: #fff;
    stroke-opacity: 0.9;
  }

  .link-selected {
    stroke: #fff;
    stroke-opacity: 0.9;
  }

  .node {
    stroke: #fff;
    stroke-width: 2;
    cursor: pointer;
  }

  .node-selected {
    stroke-width: 10;
  }

  .node:hover {
    stroke-width: 10;
  }

  .nodeName {
    fill: #ffffff;
  }

  .linkName {
    fill: #343333;
  }

  .optionButton {
    background: white;
    margin: 10px;
    box-shadow: 2px 2px 5px #cfd7e5;
    padding: 5px;
    border-radius: 20%;
  }

  .graph-render-content {
    height: 100%;
    width: 100%;
  }
</style>
