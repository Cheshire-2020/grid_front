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

export default function formatResultForJanusGraph(nodes, edges) {
  const returnedNodes = [];
  const returnedEdges = [];
  nodes.forEach((node) => returnedNodes.push(formatNodeForJanus(node)));
  edges.forEach((edge) => returnedEdges.push(formatLinkForJanus(edge)));
  return {
    node: returnedNodes,
    edge: returnedEdges,
  };
}
