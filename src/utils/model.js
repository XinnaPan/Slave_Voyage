import modelExtend from 'dva-model-extend'

export const model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export const pageModel = modelExtend(model, {
  state: {
    list: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
    },
    titles:[],
    treeData:[],


  },

  reducers: {
    queryPageSuccess(state, { payload }) {
      const { list, pagination,titles,treeData} = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        titles,
        treeData,

      }
    },

    /*queryFilterSuccess(state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          total: pagination.total
        },

      }
    },*/

    querySortSuccess(state, { payload }) {
      const { list } = payload
      return {
        ...state,
        list,
      }
    },

    queryFilterSuccess(state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },

  },


})
