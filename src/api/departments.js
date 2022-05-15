import request from '@/utils/request'

/** *
 * 获取组织架构数据
 * **/
export const getDepartments = () => {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}

/** *
 *  根据id根据部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
export const delDepartments = (id) => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}

/**
 *  新增部门接口
 *
 * ****/
export const addDepartments = data => {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

/** *
 * 获取部门详情
 * ***/
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 * ***/
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
