/**
 * 命名空间 Api.Common
 *
 * 通用类型和工具类型
 */
declare namespace Api {
  namespace Common {
    /** 分页通用参数（废弃） */
    interface PaginatingCommonParams {
      /** 当前页码 */
      current: number;
      /** 每页条数 */
      size: number;
      /** 总条数 */
      total: number;
    }

    /** 最新的分页通用参数 */
    interface PaginatingCommonQuery {
      /** 当前页码 */
      page: number;
      /** 每页条数 */
      pageSize: number;
    }

    /** 分页查询列表数据的通用参数（废弃） */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      /** 数据列表 */
      records: T[];
    }

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * 启用状态
     *
     * - "1": 启用
     * - "2": 禁用
     */
    type EnableStatus = import('../enums').EnableStatusValue;

    /** 通用记录类型 */
    type CommonRecord<T = any> = {
      /** 创建人 */
      createBy: string;
      /** 创建时间 */
      createTime: string;
      /** 记录 ID */
      id: number;
      /** 记录状态 */
      status: EnableStatus | null;
      /** 更新人 */
      updateBy: string;
      /** 更新时间 */
      updateTime: string;
    } & T;


    /**
     * 分页通用参数，最新的按照这个来
     */
    type PaginatingQuery<T extends Record<string, any> = Record<string, any>> = PaginatingCommonQuery & T;


    /**
     * 最新的列表响应结构
     *
     * @typedef {ListResponse}
     */
    type ListResponse<T> = {
      total: number;
      page: number;
      pageSize: number;
      list:T[];
    }
  }
}
