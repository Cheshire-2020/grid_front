<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      :title="$t('workplace.contentData')"
    >
      <template #extra>
        <a-link>{{ $t('workplace.viewMore') }}</a-link>
      </template>
<!--      <Chart height="289px" :option="chartOption" />-->

      <!-- 排名模块 -->
      <div class="ranking-sections">
        <!-- 国家排名 -->
        <a-card class="ranking-card" title="国家排名" hoverable>
          <a-table
              :columns="countryColumns"
              :dataSource="countryRanking"
              row-key="country"
              :pagination="pagination" />
        </a-card>

        <!-- 服务排名 -->
        <a-card class="ranking-card" title="服务排名" hoverable>
          <a-table :columns="serviceColumns" :dataSource="serviceRanking" row-key="service" :pagination="pagination" />
        </a-card>

        <!-- 端口排名 -->
        <a-card class="ranking-card" title="端口排名" hoverable>
          <a-table :columns="portColumns" :dataSource="portRanking" row-key="port" :pagination="pagination" />
        </a-card>

        <!-- 设备类型排名 -->
        <a-card class="ranking-card" title="设备类型排名" hoverable>
          <a-table :columns="deviceColumns" :dataSource="deviceRanking" row-key="device" :pagination="pagination" />
        </a-card>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { graphic } from 'echarts';
  import useLoading from '@/hooks/loading';
  import { queryContentData, ContentDataRecord } from '@/api/dashboard';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { AnyObject } from '@/types/global';

  function graphicFactory(side: AnyObject) {
    return {
      type: 'text',
      bottom: '8',
      ...side,
      style: {
        text: '',
        textAlign: 'center',
        fill: '#4E5969',
        fontSize: 12,
      },
    };
  }

  const pagination = { pageSize: 5 };

  const { loading, setLoading } = useLoading(false);
  const xAxis = ref<string[]>([]);
  const chartsData = ref<number[]>([]);
  const graphicElements = ref([
    graphicFactory({ left: '2.6%' }),
    graphicFactory({ right: 0 }),
  ]);
  // const { chartOption } = useChartOption(() => {
  //   return {
  //     grid: {
  //       left: '2.6%',
  //       right: '0',
  //       top: '10',
  //       bottom: '30',
  //     },
  //     xAxis: {
  //       type: 'category',
  //       offset: 2,
  //       data: xAxis.value,
  //       boundaryGap: false,
  //       axisLabel: {
  //         color: '#4E5969',
  //         formatter(value: number, idx: number) {
  //           if (idx === 0) return '';
  //           if (idx === xAxis.value.length - 1) return '';
  //           return `${value}`;
  //         },
  //       },
  //       axisLine: {
  //         show: false,
  //       },
  //       axisTick: {
  //         show: false,
  //       },
  //       splitLine: {
  //         show: true,
  //         interval: (idx: number) => {
  //           if (idx === 0) return false;
  //           if (idx === xAxis.value.length - 1) return false;
  //           return true;
  //         },
  //         lineStyle: {
  //           color: '#E5E8EF',
  //         },
  //       },
  //       axisPointer: {
  //         show: true,
  //         lineStyle: {
  //           color: '#23ADFF',
  //           width: 2,
  //         },
  //       },
  //     },
  //     yAxis: {
  //       type: 'value',
  //       axisLine: {
  //         show: false,
  //       },
  //       axisLabel: {
  //         formatter(value: any, idx: number) {
  //           if (idx === 0) return value;
  //           return `${value}k`;
  //         },
  //       },
  //       splitLine: {
  //         show: true,
  //         lineStyle: {
  //           type: 'dashed',
  //           color: '#E5E8EF',
  //         },
  //       },
  //     },
  //     tooltip: {
  //       trigger: 'axis',
  //       formatter(params) {
  //         const [firstElement] = params as ToolTipFormatterParams[];
  //         return `<div>
  //           <p class="tooltip-title">${firstElement.axisValueLabel}</p>
  //           <div class="content-panel"><span>总内容量</span><span class="tooltip-value">${(
  //             Number(firstElement.value) * 10000
  //           ).toLocaleString()}</span></div>
  //         </div>`;
  //       },
  //       className: 'echarts-tooltip-diy',
  //     },
  //     graphic: {
  //       elements: graphicElements.value,
  //     },
  //     series: [
  //       {
  //         data: chartsData.value,
  //         type: 'line',
  //         smooth: true,
  //         // symbol: 'circle',
  //         symbolSize: 12,
  //         emphasis: {
  //           focus: 'series',
  //           itemStyle: {
  //             borderWidth: 2,
  //           },
  //         },
  //         lineStyle: {
  //           width: 3,
  //           color: new graphic.LinearGradient(0, 0, 1, 0, [
  //             {
  //               offset: 0,
  //               color: 'rgba(30, 231, 255, 1)',
  //             },
  //             {
  //               offset: 0.5,
  //               color: 'rgba(36, 154, 255, 1)',
  //             },
  //             {
  //               offset: 1,
  //               color: 'rgba(111, 66, 251, 1)',
  //             },
  //           ]),
  //         },
  //         showSymbol: false,
  //         areaStyle: {
  //           opacity: 0.8,
  //           color: new graphic.LinearGradient(0, 0, 0, 1, [
  //             {
  //               offset: 0,
  //               color: 'rgba(17, 126, 255, 0.16)',
  //             },
  //             {
  //               offset: 1,
  //               color: 'rgba(17, 128, 255, 0)',
  //             },
  //           ]),
  //         },
  //       },
  //     ],
  //   };
  // });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryContentData();
      chartData.forEach((el: ContentDataRecord, idx: number) => {
        xAxis.value.push(el.x);
        chartsData.value.push(el.y);
        if (idx === 0) {
          graphicElements.value[0].style.text = el.x;
        }
        if (idx === chartData.length - 1) {
          graphicElements.value[1].style.text = el.x;
        }
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();

  // 各个排名的状态数据
  // 显式为各个排名的状态数据添加类型注解
  const countryRanking = ref([
    { country: '中国', assets: 4429 },
    { country: '日本', assets: 1823 },
    { country: '泰国', assets: 1015 },
    { country: '澳大利亚', assets: 289 },
    { country: '德国', assets: 8 },
    { country: '新加坡', assets: 2 },
  ]);
  const serviceRanking = ref([
    { service: 'unknown', assets: 3672 },
    { service: 'https', assets: 1511 },
    { service: 'http', assets: 474 },
    { service: 'ssh', assets: 443 },
    { service: 'rtsp', assets: 346 },
    { service: 'telnet', assets: 179 },
    { service: 'ftp', assets: 95 },
  ]);
  const portRanking = ref([
    { port: 80, assets: 1197 },
    { port: 443, assets: 1130 },
    { port: 22, assets: 474 },
    { port: 554, assets: 353 },
    { port: 21, assets: 152 },
    { port: 646, assets: 23 },
  ]);
  const deviceRanking = ref([
    { device: '安全防护设备', assets: 2650 },
    { device: '网络接入终端', assets: 170 },
    { device: '路由交换设备', assets: 154 },
    { device: '流控设备', assets: 36 },
    { device: '物联网设备', assets: 3 },
  ]);

  // 定义表格的列
  const countryColumns = [
    { title: '国家名称', dataIndex: 'country', key: 'country' },
    { title: '资产', dataIndex: 'assets', key: 'assets' },
  ];
  const serviceColumns = [
    { title: '服务名称', dataIndex: 'service', key: 'service' },
    { title: '资产', dataIndex: 'assets', key: 'assets' },
  ];
  const portColumns = [
    { title: '端口名称', dataIndex: 'port', key: 'port' },
    { title: '资产', dataIndex: 'assets', key: 'assets' },
  ];
  const deviceColumns = [
    { title: '设备类型名称', dataIndex: 'device', key: 'device' },
    { title: '资产', dataIndex: 'assets', key: 'assets' },
  ];

  // // 获取排名数据的函数
  // const fetchRankingData = async () => {
  //   setLoading(true);
  //   try {
  //     // 请求获取国家、服务、端口和设备类型的排名数据
  //     const { country, service, port, device } = await queryRankingData();
  //     console.log('接口返回数据:', { country, service, port, device });
  //     console.log(countryRanking.value); // 确保是数组
  //
  //     countryRanking.value = country;
  //     serviceRanking.value = service;
  //     portRanking.value = port;
  //     deviceRanking.value = device;
  //   } catch (err) {
  //     console.error('获取排名数据时出错:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // 在组件挂载时调用获取数据
  onMounted(() => {
    console.log(countryRanking.value);
    console.log(serviceRanking.value);
    console.log(portRanking.value);
    console.log(deviceRanking.value);

    fetchData();
  });
</script>

<style scoped>
.ranking-sections {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.ranking-card {
  flex: 1;
  margin-right: 10px;
}

.ranking-card:last-child {
  margin-right: 0;
}

</style>
