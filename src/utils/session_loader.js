const saveSessionAttr = function (key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const loadSessionAttr = function (key) {
  return JSON.parse(sessionStorage.getItem(key));
};

export { saveSessionAttr, loadSessionAttr };
