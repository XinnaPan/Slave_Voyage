import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import { Trans } from "@lingui/macro"
import city from 'utils/city'
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
  handleOk = () => {
    const { item = {}, onOk } = this.props
  }

  render() {
    const { item , onOk,treePro, 
      onExpand,onCheck,onSelect,
      ...modalProps } = this.props

    

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={treePro.expandedKeys}
          autoExpandParent={treePro.autoExpandParent}
          onCheck={onCheck}
          checkedKeys={treePro.checkedKeys}
          onSelect={onSelect}
          selectedKeys={treePro.selectedKeys}
          treeData={item}
        />
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
