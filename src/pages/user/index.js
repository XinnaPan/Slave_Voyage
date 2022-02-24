import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { history } from 'umi'
import { connect } from 'umi'
import { Row, Col, Button, Popconfirm, Icon } from 'antd'
import { t } from "@lingui/macro"
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'
import { Trans } from "@lingui/macro"


@connect(({ user, loading }) => ({ user, loading }))
class User extends PureComponent {
  handleRefresh = newQuery => {
    const { location } = this.props
    const { query, pathname } = location

    console.log("query=",query)
    history.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: 'repeat' }
      ),
    })
  }

  handleDeleteItems = () => {
    const { dispatch, user } = this.props
    const { list, pagination, selectedRowKeys } = user

    dispatch({
      type: 'user/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    }).then(() => {
      this.handleRefresh({
        page:
          list.length === selectedRowKeys.length && pagination.current > 1
            ? pagination.current - 1
            : pagination.current,
      })
    })
  }

  getName=(dic,curList,route,visited)=>{
    let data=[]
    curList.forEach(c=>{
      let res={}
      var title_start_pos = c.indexOf('_')
      res['title']=c.slice(title_start_pos+1)
      res['key']=route+(route!==''?'__':'')+res['title']
      if(dic && dic[c] && !visited.has(c)) {
        visited.add(c)
        res['children']=this.getName(dic,dic[c],res['key'],visited)
        visited.delete(c)
      }
      data.push(res)
    })
    return data
  }

  getValue = (e, titles_split,cur_ind, res )=>{
      var obj=e
      while(cur_ind < titles_split.length) {
        if(obj === null)
          break
        if(Array.isArray(obj)){
          break;
        } else 
          obj=obj[titles_split[cur_ind]]
        cur_ind = cur_ind + 1  
      } 

      if(Array.isArray(obj)) {
        var cnt=0
        for(cnt=0; cnt<obj.length;cnt++)
          res=this.getValue(obj[cnt], titles_split,cur_ind, res)
        return res
      } 

      if( res.length>0)
        res.push(';')
      if(obj !== null)
      res.push(obj.toString())
      return res
   
  }


  get modalProps() {
    const { dispatch, user, loading } = this.props
    const { treeData, modalVisible, modalType,
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
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      confirmLoading: loading.effects[`user/${modalType}`],
      title: `${
        modalType === 'create' ? t`Choose Column` : t`Update User`
      }`,
      centered: true,
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
          if(e['children'] === undefined) 
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

  get listProps() {
    const { dispatch, user, loading } = this.props
    const { titles,list, pagination, selectedRowKeys,checkedTitlesFinal } = user
    //const titlesSelected = [1,2]
    let titles_split= {} 
    checkedTitlesFinal.map( key => {
      titles_split[key]=key.split("__")
    });
    
    var columns=[]
    checkedTitlesFinal.forEach((total_title,ind) => {
      if (titles[total_title] !== undefined) {
        columns.push({
          title: <Trans>{titles[total_title]['label']}</Trans> ,
          dataIndex: total_title,
          key: total_title,
          sorter:{multiple: ind},
          sortDirections: ['descend']
          
        }
        )
      }
    })

    let newList=[];
    list.forEach(e =>{ 
      var tmpData={}
      tmpData['id']=e['id']

      checkedTitlesFinal.forEach(total_title => {
        if(titles_split[total_title] !== undefined) {
          var res=[]
          tmpData[total_title]=this.getValue(e, titles_split[total_title], 0, res )
        }
      })
      newList.push(tmpData)
      
      });
    
    return {
      dataSource: newList,
      loading: loading.effects['user/query'],
      pagination,
      //titles:res_titles,
      columns,
      onChange: (pagination, _, sorter) => {
        this.handleRefresh({
          page: pagination.current,
          pageSize: pagination.pageSize,
        })

        console.log('sorter=', sorter)
        //if(sorter.order != undefined) {

        //}
        /*var keys = ''
        if (sorter !== undefined) {
          if (sorter.length === undefined) {
            keys += sorter.columnKey
          } else {
            sorter.forEach(objs => {
              if (keys !== '')
                keys += ','
              keys += objs.columnKey
            })
          }
          dispatch({
            type: 'user/sort',
            payload: keys,
          })
        }*/
      },
     
    }
  }

  get filterProps() {
    const { location, dispatch, user} = this.props
    const { query } = location
    return {
      filter: {
        ...query,
      },
      treeData:user.treeData ,
      tagSearchTerm:user.tagSearchTerm,
      onFilterChange: value => {
        this.handleRefresh({
          ...value,
        })
      },
      onAdd() {
        dispatch({
          type: 'user/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
      //for tags added
      handleSubmit (values) {
        console.log("val=",values)
        if(values.fields === undefined || values.val ===undefined)
          return
        var last_ind=values.fields.length -1
        var fie=values.fields[last_ind]
        dispatch({
          type: 'user/handleFilter',
          payload: `${fie}=${values.val}`,
        })
      },
      handleClose(removedTag) {
        //const tags = this.state.tags.filter((tag) => tag !== removedTag);
        //console.log(tags);
        //this.setState({ tags });
        dispatch({
          type: 'user/deleteTag',
          payload: removedTag,
        })
      },

      handleClick() {
        dispatch({
          type: 'user/filter',
        })
      }
    }
  }

  render() {
    const { user } = this.props
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        
        <List {...this.listProps} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

User.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default User
