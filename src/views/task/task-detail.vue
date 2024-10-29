<template>
  <basic-container>
    <div class="layout-demo">
      <a-layout style="height: 1000px">
        <a-layout>
          <a-layout-sider theme="dark" style="width: 360px">
            <a-space direction="vertical" fill>
              <a-card
                :style="{ width: '100%', height: '300px' }"
                title="地图呈现"
              >
                <template #extra>
                  <a-link>More</a-link>
                </template>
                <div
                  class="content row-flex-start"
                  style="min-width: 300px; overflow-x: auto"
                >
                  <div
                    class="left_map"
                    id="left_map"
                    @click="showChinaMap"
                  ></div>
                </div>
              </a-card>
              <a-card :style="{ width: '100%' }" title="年份">
                <template #extra>
                  <a-link>More</a-link>
                </template>
                2021<br />
                2022
              </a-card>
              <a-card :style="{ width: '100%' }" title="ICON">
                <template #extra>
                  <a-link>More</a-link>
                </template>
                <icon-font type="icon-earth" :size="32" />
              </a-card>
              <a-card :style="{ width: '100%' }" title="CVE">
                <template #extra>
                  <a-link>More</a-link>
                </template>
                CVE-2016-8858 CVE-2019-10009
              </a-card>
              <a-card :style="{ width: '100%' }" title="IPv4/IPv6">
                <template #extra>
                  <a-link>More</a-link>
                </template>
                IPv4
              </a-card>
              <a-card :style="{ width: '100%' }" title="端口状态">
                <template #extra>
                  <a-link>More</a-link>
                </template>
                open
              </a-card>
              <a-card :style="{ width: '100%' }" title="服务">
                <template #extra>
                  <a-link>More</a-link>
                </template>
                MySQL
              </a-card>
            </a-space>
          </a-layout-sider>
          <a-layout-content style="margin-left: 20px">
            <a-space direction="vertical" fill>
              <a-list class="custom-list">
                <a-list-item>
                  <p>您搜索到~~条数据</p>
                </a-list-item>
                <a-list-item>
                  <a-space justify="end">
                    <a-button type="primary">导出报表</a-button>
                    <a-button type="primary">数据下载</a-button>
                    <a-button type="primary">POC验证</a-button>
                  </a-space>
                </a-list-item>
              </a-list>
              <a-list class="custom-list">
                <a-list-item>
                  <a-list class="custom1-list" bordered>
                    <a-list-item
                      v-for="item in data"
                      :key="item.id"
                      class="list-item"
                    >
                      <div
                        class="content row-flex-start"
                        style="
                          min-width: 300px;
                          overflow-x: auto;
                          display: flex;
                        "
                      >
                        <div class="left_task" id="left_task">
                          <div class="list-header">
                            <a-space
                              direction="vertical"
                              size="small"
                              style="line-height: 1.5"
                            >
                              <a style="margin: 0">{{ item.ip }}</a>
                              <a-tag style="margin: 0"
                                >{{ item.port }}/{{ item.protocol }}</a-tag
                              >
                              <div
                                style="
                                  display: flex;
                                  align-items: center;
                                  margin: 0;
                                "
                              >
                                <a-icon
                                  type="windows"
                                  v-if="item.os === 'Windows'"
                                />
                                <a-icon type="linux" v-else />
                                <span style="margin-left: 8px">{{
                                  item.os
                                }}</span>
                              </div>
                              <span style="margin: 0">{{ item.date }}</span>
                            </a-space>
                          </div>
                        </div>
                        <div class="right_task" id="right_task">
                          <!-- 按钮组 -->
                          <div class="button-group">
                            <a-space>
                              <a-tag color="purple" size="middle"
                                >PoC({{ item.NumPOC }})</a-tag
                              >
                              <a-tag color="red" size="middle"
                                >高危({{ item.NumHighRisk }})</a-tag
                              >
                              <a-tag color="orange" size="middle"
                                >中危({{ item.NumMiddleRisk }})</a-tag
                              >
                              <a-tag color="blue" size="middle"
                                >低危({{ item.NumLowRisk }})</a-tag
                              >
                              <p></p>
                            </a-space>
                          </div>
                          <!-- 第二行：HTTP 详细信息 -->
                          <div class="list-content">
                            <pre>{{ item.httpDetails }}</pre>
                            <!-- 预格式化文本显示 HTTP 数据 -->
                          </div>
                        </div>
                      </div>
                    </a-list-item>
                  </a-list>
                </a-list-item>
              </a-list>
            </a-space>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
  </basic-container>
</template>

<script>
  import { ref, onMounted, nextTick } from 'vue';
  import BasicContainer from '@/layout/basic-container.vue';
  import { Icon } from '@arco-design/web-vue';
  import * as echarts from 'echarts';
  import china from 'echarts/map/json/china.json';
  import axios from 'axios';

  echarts.registerMap('china', china);

  const provinces = [
    'shanghai',
    'hebei',
    'shanxi',
    'neimenggu',
    'liaoning',
    'jilin',
    'heilongjiang',
    'jiangsu',
    'zhejiang',
    'anhui',
    'fujian',
    'jiangxi',
    'shandong',
    'henan',
    'hubei',
    'hunan',
    'guangdong',
    'guangxi',
    'hainan',
    'sichuan',
    'guizhou',
    'yunnan',
    'xizang',
    'shanxi1',
    'gansu',
    'qinghai',
    'ningxia',
    'xinjiang',
    'beijing',
    'tianjin',
    'chongqing',
    'xianggang',
    'aomen',
    'taiwan',
  ];
  const provincesText = ref([
    '上海',
    '河北',
    '山西',
    '内蒙古',
    '辽宁',
    '吉林',
    '黑龙江',
    '江苏',
    '浙江',
    '安徽',
    '福建',
    '江西',
    '山东',
    '河南',
    '湖北',
    '湖南',
    '广东',
    '广西',
    '海南',
    '四川',
    '贵州',
    '云南',
    '西藏',
    '陕西',
    '甘肃',
    '青海',
    '宁夏',
    '新疆',
    '北京',
    '天津',
    '重庆',
    '香港',
    '澳门',
    '台湾',
  ]);

  export default {
    components: { BasicContainer },
    setup() {
      const IconFont = Icon.addFromIconFontCn({
        src: 'https://at.alicdn.com/t/font_180975_ue66sq60vyd.js',
      });

      const data = ref([
        {
          id: 1,
          ip: '172.18.253.190',
          port: '80',
          protocol: 'http',
          os: 'Windows',
          date: '2021-04-01',
          riskLevel: '高危',
          NumPOC: 2,
          NumHighRisk: 1,
          NumMiddleRisk: 0,
          NumLowRisk: 1,
          httpDetails:
            'HTTP/1.1 200 OK\nDate: Thu, 08 Apr 2021 07:39:17 GMT\nServer: Apache/2.4.29 (Ubuntu)\n...',
        },
        {
          id: 2,
          ip: '172.18.253.173',
          port: '443',
          protocol: 'https',
          os: 'Linux',
          date: '2021-04-01',
          riskLevel: '中危',
          NumPOC: 2,
          NumHighRisk: 1,
          NumMiddleRisk: 0,
          NumLowRisk: 1,
          httpDetails: 'HTTP/1.1 200 OK\nServer: nginx\n...',
        },
        // 其他数据
      ]);

      const components = ref([IconFont]);

      const map = ref(null);

      const getMapOpt = (place) => {
        return {
          backgroundColor: '#F3F3F3', // 地图背景颜色
          title: {
            text: '',
            subtext: '',
            left: 'center',
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              restore: {},
              saveAsImage: {},
            },
          },
          geo: {
            map: place || 'china',
            label: {
              emphasis: {
                show: false,
              },
              normal: {
                show: true,
                textStyle: {
                  color: 'rgba(0,0,0)',
                },
              },
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#ffffff', // 地图颜色
                borderColor: '#2d59b7', // 地图边线颜色
              },
              emphasis: {
                areaColor: '#c5e3ef', // 鼠标移入颜色
              },
            },
          },
        };
      };

      const getProvinceMapOpt = (provinceAlphabet) => {
        axios.get(`province/${provinceAlphabet}.json`).then((response) => {
          echarts.registerMap(provinceAlphabet, response.data);
          const option = getMapOpt(provinceAlphabet);
          map.value.setOption(option, true);
        });
      };

      const initMap = (event) => {
        const dom = document.getElementById('left_map');
        map.value = echarts.init(dom);
        const option = getMapOpt();
        map.value.setOption(option, true);
        map.value.on('click', (param) => {
          event.stopPropagation(); // 阻止冒泡
          const provinceIndex = provincesText.value.findIndex(
            (x) => param.name === x
          );
          if (provinceIndex === -1) return;
          const provinceAlphabet = provinces[provinceIndex];
          getProvinceMapOpt(provinceAlphabet);
        });
      };

      const showChinaMap = () => {
        const option = getMapOpt();
        map.value.setOption(option, true);
      };

      onMounted(() => {
        nextTick(() => {
          initMap();
        });
      });

      return {
        data,
        components,
        map,
        showChinaMap,
        getProvinceMapOpt,
        initMap,
      };
    },
  };
</script>

<style scoped>
  .layout-demo :deep(.arco-layout-header),
  .layout-demo :deep(.arco-layout-footer),
  .layout-demo :deep(.arco-layout-sider-children),
  .layout-demo :deep(.arco-layout-content) {
    display: flex;
    flex-direction: column;
  }

  .layout-demo :deep(.arco-layout-header),
  .layout-demo :deep(.arco-layout-footer) {
    height: 64px;
    background-color: #a74e4e;
  }

  .layout-demo :deep(.arco-layout-sider) {
    width: 506px;
    background-color: #eeeeee;
  }

  .layout-demo :deep(.arco-layout-content) {
    background-color: #eeeeee;
  }

  .custom-list :deep(.arco-list-item) {
    background-color: #ffffff;
  }

  .custom-list .list-item {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .list-content {
    background-color: #f9f9f9;
    padding: 12px;
    border-radius: 4px;
    overflow: auto;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #f5f5f5;
    padding: 8px;
    border-radius: 4px;
    max-height: 150px;
    overflow-y: auto;
  }

  .left_map {
    width: 320px; /* 此处设置地图大小 */
    height: 200px; /* 注意，如果父组件没有设置高度，此处可设置为px单位的高度，否则塌陷 */
  }
  .right_opetate {
    flex: 1;
    height: 100%;
    background: #404a59;
  }

  .left_task {
    width: 320px;
    height: 200px;
    display: flex;
    flex-direction: column; /* 纵向排列 */
  }

  .right_task {
    flex: 1;
    height: 200px;
    display: flex;
    flex-direction: column; /* 上下排列 */
  }
</style>
