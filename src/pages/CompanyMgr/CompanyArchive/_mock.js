export default {
  '/queryArchive': {
    pageNum: 1,
    pageSize: 10,
    size: 6,
    startRow: 1,
    endRow: 6,
    total: 6,
    pages: 1,
    list: [
      {
        id: 1,
        labelEname: 'basic',
        labelCname: '基本信息',
        isValid: '1',
        type: '表单',
        updateDate: '2019-07-19 16:41:38',
      },
      { id: 2, labelEname: 'tax', labelCname: '纳税信息', isValid: '1', type: '列表' },
      { id: 3, labelEname: 'insurance', labelCname: '五险信息', isValid: '1', type: '列表' },
      { id: 4, labelEname: 'supervise', labelCname: '公共监督', isValid: '1', type: '列表' },
      { id: 5, labelEname: 'intellectual', labelCname: '知识产权', isValid: '1', type: '列表' },
      { id: 6, labelEname: 'energy', labelCname: '能耗信息', isValid: '1', type: '列表' },
    ],
    prePage: 0,
    nextPage: 0,
    isFirstPage: true,
    isLastPage: true,
    hasPreviousPage: false,
    hasNextPage: false,
    navigatePages: 8,
    navigatepageNums: [1],
    navigateFirstPage: 1,
    navigateLastPage: 1,
    firstPage: 1,
    lastPage: 1,
  },
  '/api/archive/queryContentType': [
    {
      dictValue: 1,
      treeNames: '表单',
    },
    {
      dictValue: 2,
      treeNames: '列表',
    },
  ],
};
