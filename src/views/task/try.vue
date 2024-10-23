<template>
  <div
    class="content row-flex-start"
    style="min-width: 1500px; ovorflow-x: auto"
  >
    <div class="left_map" id="left_map" @click="showChinaMap"></div>
    <div class="right_opetate row-center" id="right_opetate"> </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import echarts from 'echarts';
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
  const provincesText = [
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
  ];

  export default defineComponent({
    created() {},
    mounted() {
      this.$nextTick(() => {
        this.initMap();
      });
    },
    data() {
      return {
        map: {},
      };
    },
    props: {},
    methods: {
      getMapOpt(place) {
        const option = {
          backgroundColor: '#F3F3F3',
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
              // 不需要显示地名可直接删除normal此项
              normal: {
                show: true, // 是否显示对应地名
                textStyle: {
                  color: 'rgba(0,0,0)',
                },
              },
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#6FA7CE',
                borderColor: '#fff',
              },
              emphasis: {
                areaColor: '#B7DFED',
              },
            },
          },
        };
        return option;
      },
      // 显示中国地图
      showChinaMap() {
        const option = this.getMapOpt();
        this.map.setOption(option, true);
      },
      // 显示各省地图，这里使用axios请求本地文件，provice文件夹存在的位置为public/province（旧版本是static）
      getProvinceMapOpt(provinceAlphabet) {
        axios.get(`province/${provinceAlphabet}.json`).then((s) => {
          echarts.registerMap(provinceAlphabet, s.data);
          const option = this.getMapOpt(provinceAlphabet);
          this.map.setOption(option, true);
        });
      },
      initMap() {
        const dom = document.getElementById('left_map');
        this.map = echarts.init(dom);
        const option = this.getMapOpt();
        if (option && typeof option === 'object') {
          this.map.setOption(option, true);
        }
        this.map.on('click', (param) => {
          // console.log(param)
          // eslint-disable-next-line no-restricted-globals
          event.stopPropagation(); // 阻止冒泡
          // 找到省份名
          const provinceIndex = provincesText.findIndex((x) => {
            return param.name === x;
          });
          if (provinceIndex === -1) return;
          const provinceAlphabet = provinces[provinceIndex];
          // 重新渲染各省份地图
          this.getProvinceMapOpt(provinceAlphabet);
        });
      },
    },
    computed: {},
  });
</script>

<style scoped lang="less">
  .left_map {
    width: 1200px; //此处设置地图大小
    height: 100%; //注意，如果父组件没有设置高度，此处可设置为px单位的高度，否则塌陷
  }
  .right_opetate {
    flex: 1;
    height: 100%;
    background: #404a59;
  }
</style>
