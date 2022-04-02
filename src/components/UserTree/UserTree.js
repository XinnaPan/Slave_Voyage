import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import { Trans } from "@lingui/macro"
import { t } from "@lingui/macro"





class UserTree extends PureComponent {
  formRef = React.createRef()


  render() {
    const { item,
      treePro,
      onExpand,
      onCheck, 
      onSelect,
      } = this.props

    

    return (
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={treePro.expandedKeys}
          autoExpandParent={treePro.autoExpandParent}
          onCheck={onCheck}
          checkedKeys={treePro.checkedTitlesTmp}
          onSelect={onSelect}
          selectedKeys={treePro.selectedTitlesTmp}
          treeData={item}
        />
    )
  }
}


export default UserTree
