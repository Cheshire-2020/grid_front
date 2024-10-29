import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}

// 定义 queryRankingData 函数，返回静态数据
export const queryRankingData = async () => {
  // 模拟的静态数据
  return {
    country: [
      { country: '中国', assets: 4429 },
      { country: '日本', assets: 1823 },
      { country: '泰国', assets: 1015 },
      { country: '澳大利亚', assets: 289 },
      { country: '德国', assets: 8 },
      { country: '新加坡', assets: 2 },
    ],
    service: [
      { service: 'unknown', assets: 3672 },
      { service: 'https', assets: 1511 },
      { service: 'http', assets: 474 },
      { service: 'ssh', assets: 443 },
      { service: 'rtsp', assets: 346 },
      { service: 'telnet', assets: 179 },
      { service: 'ftp', assets: 95 },
    ],
    port: [
      { port: 80, assets: 1197 },
      { port: 443, assets: 1130 },
      { port: 22, assets: 474 },
      { port: 554, assets: 353 },
      { port: 21, assets: 152 },
      { port: 646, assets: 23 },
    ],
    device: [
      { device: '安全防护设备', assets: 2650 },
      { device: '网络接入终端', assets: 170 },
      { device: '路由交换设备', assets: 154 },
      { device: '流控设备', assets: 36 },
      { device: '物联网设备', assets: 3 },
    ],
  };
};

