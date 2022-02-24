import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Trans } from "@lingui/macro"
import { t } from "@lingui/macro"
import { Button, Row, Col, DatePicker, Form, Input, Cascader, Tag } from 'antd'
import { SettingOutlined } from '@ant-design/icons';
import { TweenOneGroup } from "rc-tween-one";
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Search } = Input
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

class Filter extends Component {
  formRef = React.createRef()
  handleReset = () => {
    const fields = this.formRef.current.getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    this.formRef.current.setFieldsValue(fields)
    
  }

  
  render() {
    const { onAdd, treeData, tagSearchTerm, handleSubmit, handleClose, handleClick } = this.props
    
    const submitAndClean=(e)=>{
      handleSubmit(e);
      this.handleReset();
    }
  
    
    const forMap = (tag) => {
      const tagElem = (
        <Tag
          closable
          onClose={(e) => {
            e.preventDefault();
            handleClose(tag);
          }}
        >
          {tag}
        </Tag>
      );
      return (
        <span key={tag} style={{ display: "inline-block" }}>
          {tagElem}
        </span>
      );
    };

    const tagChild = tagSearchTerm.map(forMap);
    return (
      <Form ref={this.formRef} name="control-ref" onFinish={submitAndClean}>

          <Row gutter={24}>
            <Col {...ColProps}>
              <TweenOneGroup
                enter={{
                  scale: 0.8,
                  opacity: 0,
                  type: "from",
                  duration: 100
                }}
                onEnd={(e) => {
                  if (e.type === "appear" || e.type === "enter") {
                    e.target.style = "display: inline-block";
                  }
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
              >
                {tagChild}
              </TweenOneGroup>
            </Col>
          </Row>
          <Row>
            <Col style={{ marginRight: 10, marginTop: 4, }}>
              <label>add search term   </label>
            </Col>
            <Col
              {...ColProps}
              xl={{ span: 6 }}
              md={{ span: 12 }}
              id="addressCascader"
            >
              <Form.Item name="fields" >
                <Cascader
                  style={{ width: '100%' }}
                  options={treeData}
                  placeholder={t`Please choose the field`}
                />
              </Form.Item>
            </Col>
            <Col style={{ marginBottom: 16, marginTop: 4 }}>
              <label> = </label>
            </Col>
            <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
              <Form.Item name="val" >
                <Input
                  placeholder={t`Add value`}
                />
              </Form.Item>
            </Col>

            <Row gutter={24}>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />} ></Button>
              </Form.Item>
            </Col>

          <Col style={{ marginBottom: 16}}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} onClick={handleClick}></Button>
            </Form.Item>
          </Col>
          <Col style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={this.handleReset}>
              <Trans>Reset</Trans>
            </Button>
          </Col>
          </Row>

          </Row>
         
        <Row>
         
          <Col
            {...TwoColProps}
            xl={{ span: 10 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
          >
            <Row type="flex" align="middle" justify="space-between">
              <Button type="ghost" onClick={onAdd}>
                <Trans>Add Title</Trans>
              </Button>
             
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  filter: PropTypes.object,
}

export default Filter
