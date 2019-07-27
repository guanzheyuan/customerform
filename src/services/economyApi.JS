// import { stringify } from 'qs';
import request from '@/utils/request';
// import { interfaceDeclaration } from '@babel/types';

// const basicUrl="http://localhost:8080/interface/sop";
const basicUrl="";

// eslint-disable-next-line import/prefer-default-export
export async function getList(params) {
    return request(`${basicUrl}/zzw/Test`, {
      method: 'POST',
      data: {
        ...params,
        method: 'post',
      },
    });
  }

  export async function getJjyxidexinfoList(params) {
    let url = `${basicUrl}/ecorun/jjyxindexinfo?`;
    if(params.indexName!=null&& params.indexName.length>0){
      url = `${url}indexName=${params.indexName}&`;
    }
    if(params.indexLevel!=null&& params.indexLevel.length>0){
      url = `${url}indexLevel=${params.indexLevel}&`;
    }
    if(params.yearDate!=null&& params.yearDate.length>0){
      url = `${url}yearDate=${params.yearDate}&`;
    }
    if(params.indexType!=null&& params.indexType.length>0){
      url = `${url}indexType=${params.indexType}&`;
    }
    if(params.respDept!=null&& params.respDept.length>0){
      url = `${url}respDept=${params.respDept}&`;
    }
    return request(url);
  }

  export async function addJjyxidexinfo(params) {
    const url = `${basicUrl}/ecorun/jjyxindexinfo`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function addJjyxidexinfoList(params) {
    const url = `${basicUrl}/ecorun/jjyxindexinfo/addJjyxIndexInfoT`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function deleteJjyxidexinfo(params) {
    const url = `${basicUrl}/ecorun/jjyxindexinfo/${params.id}`;
    return request(url, {
      method: 'DELETE'
    });
  }

  export async function deleteJjyxidexTargetYear(params) {
    const url = `${basicUrl}/ecorun/jjyxindextargetyear/${params.targetId}`;
    return request(url, {
      method: 'DELETE'
    });
  }

  export async function updateJjyxidexinfo(params) {
    const url = `${basicUrl}/ecorun/jjyxindexinfo`;
    return request(url, {
      method: 'PATCH',
      data: {
        ...params
      },
    });
  }

  export async function selectTargetYearList(params) {
    const url = `${basicUrl}/ecorun/jjyxindextargetyear/selectTargetYearList`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function addTargetYear(params) {
    const url = `${basicUrl}/ecorun/jjyxindextargetyear/addTargetYear`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function updateTargetYear(params) {
    const url = `${basicUrl}/ecorun/jjyxindextargetyear/updateTargetYear`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function selectTargetProcessList(params) {
    const url = `${basicUrl}/ecorun/jjyxindextargetprocess/selectTargetProcessList`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function getProjectTargetYearList(params) {
    const url = `${basicUrl}/ecorun/jjyxprojecttargetyear/selectProjectTargetYearDtoList`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }


  export async function addProjectTargetYear(params) {
    const url = `${basicUrl}/ecorun/jjyxprojecttargetyear/addProjectTargetYearT`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function deleteJjyxProjectTarget(params) {
    const url = `${basicUrl}/ecorun/jjyxprojecttargetyear/${params.id}`;
    return request(url, {
      method: 'DELETE'
    });
  }


  export async function updateProjectTargetYear(params) {
    const url = `${basicUrl}/ecorun/jjyxprojecttargetyear/updateProjectTargetProcessT`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function addProjectActualProcess(params) {
    const url = `${basicUrl}/ecorun/jjyxprojectactualprocess/addProjectActualProcess`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function getJjyxProjectActualProcess(params) {
    let url = `${basicUrl}/ecorun/jjyxprojectactualprocess`;
    if(params.projectYearTargetId!=null){
      url = `${url}?projectYearTargetId=${params.projectYearTargetId}`;
    }
    return request(url);
  }


  export async function deleteProjectTargetYear(params) {
    const url = `${basicUrl}/ecorun/jjyxprojecttargetyear/deleteProjectTargetYear`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function searchtype(params) {
    const url = `${basicUrl}/ecorun/jjyxindexinfo/park/searchtype`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }


  export async function gridList() {
    const url = `${basicUrl}/ecorun/grid/list`;
    return request(url);
  }

  export async function emlabelList() {
    const url = `${basicUrl}/ecorun/emlabel/list`;
    return request(url);
  }

  export async function mapinfo(params) {
    const url = `${basicUrl}/ecorun/jjyxindexinfo/park/mapinfo`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function enterprisesearchtype(params) {
    const url = `${basicUrl}/ecorun/jjyxenterpriseindex/enterprise/searchtype`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function labeEnableList() {
    const url = `${basicUrl}/ecorun/jjyxenterpriseindex/labeEnableList`;
    return request(url);
  }

  export async function enterprisegridList() {
    const url = `${basicUrl}/ecorun/jjyxenterpriseindex/gridList`;
    return request(url);
  }

  export async function enterprisemapinfo(params) {
    const url = `${basicUrl}/ecorun/jjyxenterpriseindex/enterprise/mapinfo`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function getIndexValue(params) {
    const url = `${basicUrl}/ecorun/jjyxenterpriseindex/enterprise/getIndexValue`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function selectIndexTargetActualProcessList(params) {
    const url = `${basicUrl}/ecorun/jjyxindextargetyear/selectIndexTargetActualProcessList`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function adupIndexActualProcess(params) {
    const url = `${basicUrl}/ecorun/jjyxindexactualprocess/adupIndexActualProcess`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }

  export async function lotUpdateIndexActualProcess(params) {
    const url = `${basicUrl}/ecorun/jjyxindexactualprocess/lotUpdateIndexActualProcess`;
    return request(url, {
      method: 'POST',
      data: {
        ...params
      },
    });
  }



