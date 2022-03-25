import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Trans } from "@lingui/macro"
import { t } from "@lingui/macro"
import { Button, Row, Col, DatePicker, Form, Input, Cascader, Tag , Space } from 'antd'
import { SettingOutlined } from '@ant-design/icons';
import { TweenOneGroup } from "rc-tween-one";
import { MinusOutlined,PlusOutlined, SearchOutlined,MinusCircleOutlined,PlusCircleOutlined } from '@ant-design/icons';

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
    const { onAdd, treeData, 
      tagSearchTerm, 
      handleSubmit, 
      handleClose, 
      handleClick,
      onChange,
      flag,
      } = this.props

    const submitAndClean=(e)=>{
      //handleSubmit(e);
      //this.handleReset();
      console.log("here:",e)
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

    const SearchList = () => {
      return(
        <Form.List name="search_term" initialValue={[{}]} >
          {
            (fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField },index) => 
              {
                return(
                  <Space key={key} style={{ display: 'flex'}} align="baseline" span={24}>
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                    >
                      <Input placeholder="Search Field" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                    >
                      <Input placeholder="value" />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                    {index === fields.length - 1 && <PlusCircleOutlined onClick={() => add()} />}
                  </Space>
                )}
                )}
                
        </>)
        }
      </Form.List>)
    }


    return (
      <>
        <Form ref={this.formRef} name="control-ref" onFinish={submitAndClean}>
          <Row>
            <Form.Item>
              Enter keywords and values.
            </Form.Item>
          </Row>

          <SearchList />
          <Row>
            <Col span={24} style={{ marginBottom: 16 }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}></Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Button type="ghost" onClick={onAdd}>
          <Trans>Add Title</Trans>
        </Button>
      </>
    )
  }
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  filter: PropTypes.object,
}

export default Filter
