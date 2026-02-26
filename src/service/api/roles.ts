import { request } from '../request';
import { ROLES_URLS } from '../urls';


/**
 * 角色管理列表
 *
 * @export
 * @param {Api.Roles.PaginatingQuery} params
 * @returns {*}
 */
export function fetchRolesList(params: Api.Roles.PaginatingQuery) {
  return request<Api.Roles.List>({
    method: 'get',
    params,
    url: ROLES_URLS.SYSTEM_ROLE_LIST
  });
}


/**
 * 增加角色
 *
 * @export
 * @param {Api.Roles.AddRequest} data
 * @returns {*}
 */
export function fetchAddRoles(data: Api.Roles.AddRequest) {
  return request<any>({
    method: 'post',
    data,
    url: ROLES_URLS.SYSTEM_ROLE_BASE
  });
}


/**
 * 角色详情
 *
 * @export
 * @param {Api.Roles.DelRequest} data
 * @returns {*}
 */
export function fetchDelRoles(data: Api.Roles.DelRequest) {
  return request<any>({
    method: 'delete',
    data,
    url: ROLES_URLS.SYSTEM_ROLE_BASE
  });
}


/**
 * 角色详情
 *
 * @export
 * @param {number} roleId
 * @returns {*}
 */
export function fetchRoleDetails(roleId: number) {
  return request<any>({
    url: `${ROLES_URLS.SYSTEM_ROLE_BASE}/${roleId}`
  });
}


/**
 * 更新角色状态
 *
 * @export
 * @param {Api.Roles.ChangeStatusRequest} data
 * @returns {*}
 */
export function fetchPutRoleStatus(data: Api.Roles.ChangeStatusRequest) {
  return request<any>({
    method: 'put',
    data,
    url: ROLES_URLS.SYSTEM_ROLE_CHANGESTATUS
  });
}



/**
 * 更新角色信息
 *
 * @export
 * @param {Api.Roles.UpdateRequest} data
 * @returns {*}
 */
export function fetchPutRole(data: Api.Roles.UpdateRequest) {
  return request<any>({
    method: 'put',
    data,
    url: ROLES_URLS.SYSTEM_ROLE_BASE
  });
}
