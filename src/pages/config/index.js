import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'umi'
import { Tabs } from 'antd'
import { history } from 'umi'
import { stringify } from 'qs'
import { t } from "@lingui/macro"
import { Page,UserTree } from 'components'
import List from './components/List'
import { message,Button } from 'antd'
import { Trans } from "@lingui/macro"





@connect(({ config,  loading ,titles }) => ({ config ,  loading ,titles}))

class Config extends PureComponent {
  handleTabClick = key => {
    const { pathname } = this.props.location

    history.push({
      pathname,
      search: stringify({
        status: key,
      }),
    })
  }


  get TreeProps() {
    const { dispatch, config, titles } = this.props
    const { 
        expandedKeys,
        checkedTitlesTmp,
        selectedTitlesTmp,
      } = config

    return {
      treePro:{
        expandedKeys,
        checkedTitlesTmp,
        selectedTitlesTmp,
      },
      item:titles.treeData,
      

      onExpand: expandedKeysValue => {
        dispatch({
          type:'config/expandedKeysf',
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
          type:'config/checkedKeysf',
          payload:node
        })
      },

      onSelect : selectedKeysValue=> {
        console.log("select",selectedKeysValue)

        dispatch({
          type:'config/selectedKeysf',
          payload:selectedKeysValue
        })
      },
    }
  }

  render() {

    const handle_click =()=>{
      const {config,dispatch} = this.props
      //message.success(content, [duration], onClose)
      
      dispatch({
        type:'titles/queryUpdateTitles',
        payload:{
          checkedTitles_shared:config.checkedTitlesTmp
        }
      }).then(
        message.success({
        content: 'Configuration saved',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
      }))
    }
    return (
      <Page inner>
        <UserTree {...this.TreeProps}></UserTree>
        <Button type="primary" 
          onClick={handle_click}
        >
          <Trans>Save</Trans>
        </Button>
      </Page>
    )
  }
}

export default Config
