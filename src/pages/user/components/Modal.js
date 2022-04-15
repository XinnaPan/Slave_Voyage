import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import { Trans } from "@lingui/macro"
import { t } from "@lingui/macro"

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}




class UserModal extends PureComponent {
  formRef = React.createRef()


  render() {
    const { item, onOk, treePro,
      onExpand, onCheck, onSelect,
      ...modalProps } = this.props

    

    return (
      <Modal {...modalProps} onOk={onOk}>
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
      </Modal>
    )
  }
}

export default UserModal
