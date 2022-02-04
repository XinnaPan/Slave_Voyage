import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { t } from "@lingui/macro"
import { Trans } from "@lingui/macro"
import { Link } from 'umi'
import styles from './List.less'

const { confirm } = Modal

class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }

  
  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props

    var columns// = tableProps.titles.map(t=>[{title:<Trans>`${t}`</Trans>,dataIndex:t,key:t}])
    =[
      {
        title: <Trans>Votage ID</Trans>,
        dataIndex: 'id',
        key: 'id',
        width: '7%',
        
      }]

      tableProps.titles.map(t=>{columns.push(
        {title:<Trans>{t}</Trans>,dataIndex:t,key:t}
        )})
      


    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
