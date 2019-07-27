import request from '@/utils/request';

export async function echartsSource() {
  return request('/api/echarts');
}

export async function TrendsSource() {
  return request('/actiic/trends');
}
