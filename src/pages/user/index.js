import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { history } from 'umi'
import { connect } from 'umi'
import { Row, Col, Button, Popconfirm } from 'antd'
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
      res.push(obj.toString())
      return res

   
  }


  get modalProps() {
    const { dispatch, user, loading } = this.props
    const { titles,currentItem, modalVisible, modalType,
      expandedKeys,
      checkedKeys,
      selectedKeys,
      autoExpandParent, } = user

    let titlesNames= []
    Object.keys(titles).map((key) => titlesNames.push(key.split("__")));
    titlesNames.splice(0,4)

    //console.log("titlesNames =",titlesNames)
    let arr_parent=new Set()
    let dic_child={};
    titlesNames.forEach(t=>{
      arr_parent.add(`0_${t[0]}`);
      for(let cnt=1;cnt<t.length;cnt++){
        if(!dic_child[`${cnt-1}_${t[cnt-1]}`]){
          dic_child[`${cnt-1}_${t[cnt-1]}`]=new Set()
        }
        dic_child[`${cnt-1}_${t[cnt-1]}`].add(`${cnt}_${t[cnt]}`)

      }
    })

    var visited = new Set()
    var treeData=this.getName(dic_child,arr_parent,"",visited)
    return {
      treePro:{
        expandedKeys,
        checkedKeys,
        selectedKeys,
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
          payload: checkedKeys,
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
    const { titles,list, pagination, selectedRowKeys,checkedTmpKeys } = user
    
    //const titlesSelected = [1,2]

    let titles_split= {} 
    checkedTmpKeys.map( key => {
      titles_split[key]=key.split("__")
    });
    
    var columns=[]
    checkedTmpKeys.forEach(total_title => {
      //console.log(total_title)
      if (titles[total_title] !== undefined) {
        columns.push({
          title: <Trans>{titles[total_title]['label']}</Trans>,
          dataIndex: total_title,
          key: total_title
        }
        )
      }
    })

    let newList=[];
    list.forEach(e =>{ 
      var tmpData={}
      tmpData['id']=e['id']

      checkedTmpKeys.forEach(total_title => {
        var res=[]
        tmpData[total_title]=this.getValue(e, titles_split[total_title], 0, res )
      })
      newList.push(tmpData)
      
      });
    
    
        
    return {
      dataSource: newList,
      loading: loading.effects['user/query'],
      pagination,
      //titles:res_titles,
      columns,
      onChange: page => {
        this.handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem: id => {
        dispatch({
          type: 'user/delete',
          payload: id,
        }).then(() => {
          this.handleRefresh({
            page:
              list.length === 1 && pagination.current > 1
                ? pagination.current - 1
                : pagination.current,
          })
        })
      },
      onEditItem(item) {
        dispatch({
          type: 'user/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: keys => {
          dispatch({
            type: 'user/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }
  }

  get filterProps() {
    const { location, dispatch } = this.props
    const { query } = location

    return {
      filter: {
        ...query,
      },
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
    }
  }

  render() {
    const { user } = this.props
    const { selectedRowKeys } = user

    return (
      <Page inner>
        <Filter {...this.filterProps} />
        {selectedRowKeys.length > 0 && (
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm
                title="Are you sure delete these items?"
                placement="left"
                onConfirm={this.handleDeleteItems}
              >
                <Button type="primary" style={{ marginLeft: 8 }}>
                  Remove
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        )}
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
