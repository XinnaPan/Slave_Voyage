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


@connect(({ user, loading,titles }) => ({ user, loading,titles }))
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

  getValue = (e, titles_split,cur_ind, res )=>{
      var obj=e
      while(cur_ind < titles_split.length) {
        if(!obj)
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
    const { dispatch, user, loading ,titles} = this.props
    const {modalVisible, modalType,
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
      item:titles.checked_titles_global,
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
    const {  user, loading,titles } = this.props
    const { list, pagination, checkedTitlesFinal } = user
    //const titlesSelected = [1,2]
    let titles_split= {} 
    checkedTitlesFinal.map( key => {
      titles_split[key]=key.split("__")
    });
    var columns=[]
    checkedTitlesFinal.forEach((total_title,ind) => {
        columns.push({
          title: <Trans>{titles.key_label[total_title]}</Trans> ,
          dataIndex: total_title,
          key: total_title,
          sorter:{multiple: ind},
          sortDirections: ['descend']
          
        }
        )
    })

    let newList=[];
    list.forEach(e =>{ 
      var tmpData={}
      tmpData['id']=e['id']

      checkedTitlesFinal.forEach(total_title => {
        if(titles_split[total_title]) {
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

        let params = {
          page: pagination.current,
          pageSize: pagination.pageSize,
        }
        if (sorter.column !== undefined) {
          if (sorter.length === undefined) {
            params['order_by'] = sorter.columnKey
          } else {
            let keys=''
            sorter.forEach(objs => {
              if (keys !== '')
                keys += ','
              keys += objs.columnKey
            })
            params['order_by'] = keys
          }
        } else {
          params['order_by'] = undefined
        }

        this.handleRefresh(
          params
        )

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
    const { location, dispatch, user,titles} = this.props
    const { query } = location

    return {
      filter: {
        ...query,
      },
      AutoComplete_options:user.autoComplete_options,
      treeData:titles.checked_titles_global ,
      tagSearchTerm:user.tagSearchTerm,
      integerflag:user.integerRange,
      key_type:titles.key_type,
      integer_min:user.tmp_integer_min,
      integer_max:user.tmp_integer_max,
      slider_flag:user.slider_flag,
      
      onAdd() {
        dispatch({
          type: 'user/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
      AutoComplete_onsearch: (value, title) => {
        var params = new FormData();
        params.append(title,value)
        console.log('autodata:',title, value)
        dispatch({
          type: 'user/autoComplete',
          payload: {
            params:params,
            title:title
          },
        })
        /*dispatch({
          type: 'updateAutoCompleteOptions',
           payload:[{value:'nana1'},{value:'nana2'}]
          })*/
        

      },
     
      handleSubmit:(values)=> {
        //var params = {}
        console.log('values',values.search_term)
        var params = new FormData();
        values.search_term.forEach(items=>{
          if( items.key && items.value) {
            params.append(items.key.length >1?items.key[items.key.length-1]:items.key,items.value.length>1?items.value.join(','):items.value)
            //params.append('id','200,300')
          }
        })
        
        //params.append('id','200,300')
        //params["id"]=[200,300];
        dispatch({
          type: 'user/filter',
          payload: {
            params:params
          },
        })
        //this.handleRefresh(params)
        
      },

      onChange:(value) =>{
        const {key_type} = titles
        let len=value.length-1
        const name = value[len]
        console.log('name', key_type[name])
        if (key_type[name] === "<class 'rest_framework.fields.IntegerField'>") {
          dispatch({
            type: 'user/rangeCheck',
            payload: name,
          })
        } else {
          var temp={}
          temp[key_type[name]]=false;
          const flags={...user.slider_flag,...temp}
          dispatch({
            type: 'user/changeSliderFlag',
            payload: flags,
          })
        }
        
      },

      //onSliderChange:(value)=>{}
    }
  }

  render() {
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <List {...this.listProps} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

export default User
