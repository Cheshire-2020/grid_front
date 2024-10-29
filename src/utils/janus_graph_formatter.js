const formatLinkForJanus = function (edge) {
  return {
    source: edge.inV.id,
    target: edge.outV.id,
    label: edge.label,
    properties: edge.properties,
  };
};

const formatNodeForJanus = function (node) {
  node.group = node.label;
  if (node.name === null || node.name === undefined) {
    node.name = 'test';
  }
  return node;
};

const formatLinkFormysql = function (edge) {
  return {
    source: edge.inV.id,
    target: edge.outV.id,
    label: edge.srcIpCountryCode,
    properties: edge,
  };
};

const formatNodeFormysql = function (node) {
  node.group = node.id;
  node.label = node.id;
  node.name = node.id;
  node.desc = JSON.stringify(node);
  return node;
};

function formatResultForJanusGraph(nodes, edges) {
  const returnedNodes = [];
  const returnedEdges = [];
  nodes.forEach((node) => returnedNodes.push(formatNodeForJanus(node)));
  edges.forEach((edge) => returnedEdges.push(formatLinkForJanus(edge)));
  return {
    node: returnedNodes,
    edge: returnedEdges,
  };
}

function formatResultForMysqlGraph(nodes, edges) {
  const returnedNodes = [];
  const returnedEdges = [];
  nodes.forEach((node) => returnedNodes.push(formatNodeFormysql(node)));
  edges.forEach((edge) => returnedEdges.push(formatLinkFormysql(edge)));
  return {
    node: returnedNodes,
    edge: returnedEdges,
  };
}

export { formatResultForJanusGraph, formatResultForMysqlGraph };
