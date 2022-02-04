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

  getName=(dic,curList,route)=>{
    let data=[]
    curList.forEach(c=>{
      let res={}
      res['title']=c
      res['key']=route+c
      if(dic && dic[c]) {
        res['children']=this.getName(dic,dic[c],route+c)
      }
      data.push(res)
    })
    return data
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

    let arr_parent=new Set()
    let dic_child={};
    titlesNames.forEach(t=>{
      arr_parent.add(t[0]);
      for(let cnt=1;cnt<t.length;cnt++){
        if(!dic_child[t[cnt-1]]){
          dic_child[t[cnt-1]]=new Set()
        }
        dic_child[t[cnt-1]].add(t[cnt])

      }
    })

    var treeData=this.getName(dic_child,arr_parent,"")
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
    console.log(treeData)
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
      onOk: data => {
        dispatch({
          type: `user/${modalType}`,
          payload: data,
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

      onCheck : checkedKeysValue => {
       // console.log("??????????",checkedKeysValue)
        dispatch({
          type:'user/checkedKeysf',
          payload:checkedKeysValue
        })
      },

      onSelect : selectedKeysValue=> {

        dispatch({
          type:'user/selectedKeysf',
          payload:selectedKeysValue
        })
      },
    }
  }

  get listProps() {
    const { dispatch, user, loading } = this.props
    const { titles,list, pagination, selectedRowKeys } = user
    
    const titlesSelected = [1,2]

    console.log("list");
    console.log(list);
    console.log("titles");
    console.log(titles);

    let titlesNames= []
    Object.keys(titles).map((key) => titlesNames.push(key.split("__")));
    titlesNames.splice(0,4)
    
    let res_titles=[]
    for(var ind in titlesSelected) {
      let title_name_tmp=''
      const tmp_name=titlesNames[titlesSelected[ind]]
      tmp_name.forEach(tmp => {
        if(title_name_tmp!=='')
          title_name_tmp+='__'
        title_name_tmp+=tmp
      })
      res_titles.push(title_name_tmp)
    }


    let newList=[];
    list.forEach(e =>{ 
      let tmpData={}
      tmpData['id']=e["id"]
      let cnt=0;
      for(var ind in titlesSelected) {
        const tmp_name=titlesNames[titlesSelected[ind]]
        let obj=e;
        tmp_name.forEach(tmp => {
          if(obj === null)
            return;
          obj=obj[tmp];
        })
        tmpData[res_titles[cnt]]=obj;
        cnt++;

      }
      newList.push(tmpData)
      /*let data1="null";
      let data2="null";
      if(e["voyage_itinerary"]["port_of_departure"] !== null)
        data1=e["voyage_itinerary"]["port_of_departure"]["place"]
      else data1="null"
      if(e["voyage_itinerary"]["int_first_port_emb"]!==null)
        data2=e["voyage_itinerary"]["int_first_port_emb"]["place"]
      else data2="null"
      newList.push({
        id:e["id"], 
        data1,
        data2})*/
      });
    
      //console.log(newList)
    
    return {
      dataSource: newList,
      loading: loading.effects['user/query'],
      pagination,
      titles:res_titles,
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
