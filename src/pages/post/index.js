import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'umi'
import { Tabs } from 'antd'
import { history } from 'umi'
import { stringify } from 'qs'
import { t } from "@lingui/macro"
import { Page,UserTree } from 'components'
import List from './components/List'

const { TabPane } = Tabs

const EnumPostStatus = {
  UNPUBLISH: 1,
  PUBLISHED: 2,
}

@connect(({ user,  loading }) => ({ user,  loading }))
class Post extends PureComponent {
  handleTabClick = key => {
    const { pathname } = this.props.location

    history.push({
      pathname,
      search: stringify({
        status: key,
      }),
    })
  }

  get listProps() {
    const { post, loading, location } = this.props
    const { list, pagination } = post
    const { query, pathname } = location

    return {
      pagination,
      dataSource: list,
      loading: loading.effects['post/query'],
      onChange(page) {
        history.push({
          pathname,
          search: stringify({
            ...query,
            page: page.current,
            pageSize: page.pageSize,
          }),
        })
      },
    }
  }

  get TreeProps() {
    const { dispatch, user, loading } = this.props
    const { treeData, 
      expandedKeys,
      checkedTitlesTmp,
      selectedTitlesTmp,
      autoExpandParent, } = user

    return {
      treePro:{
        expandedKeys,
        checkedTitlesTmp,
        selectedTitlesTmp,
        autoExpandParent,
      },
      item:treeData,
      
      onOk: () => {
        dispatch({
          type: `user/${modalType}`,
          payload: checkedTitlesTmp,
        }).then(() => {
          this.handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'user/hideModal',
        })
      },

      onExpand: expandedKeysValue => {
        dispatch({
          type:'user/expandedKeysf',
          payload:expandedKeysValue
        })
      },

      onCheck : (checkedKeysValue,checkedNodes) => {
        console.log("check=",checkedNodes)
        var node=[]
        checkedNodes['checkedNodes'].forEach( e =>{
            node.push(e['key'])
        })
        dispatch({
          type:'user/checkedKeysf',
          payload:node
        })
      },

      onSelect : selectedKeysValue=> {
        console.log("select",selectedKeysValue)

        dispatch({
          type:'user/selectedKeysf',
          payload:selectedKeysValue
        })
      },
    }
  }

  render() {
    const { location } = this.props
    const { query } = location

    return (
      <Page inner>
        <UserTree {...this.TreeProps}></UserTree>
      </Page>
    )
  }
}

Post.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default Post
