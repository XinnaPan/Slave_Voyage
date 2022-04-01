import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Trans } from "@lingui/macro"
import { t } from "@lingui/macro"
import { Slider,Button, Row, Col, DatePicker, Form, Input, Cascader, Tag , Space } from 'antd'
import {  SearchOutlined,MinusCircleOutlined,PlusCircleOutlined } from '@ant-design/icons';

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
      handleSubmit, 
      handleClose, 
      onChange,
      key_type,
      integer_min,
      integer_max,
      slider_flag,
      filter
      } = this.props

    const submitAndClean=(e)=>{
      //handleSubmit(e);
      //this.handleReset();
      handleSubmit(e);
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


    const ValueInput = (props) =>{
      const { index ,onChange,filter } =props
      const handleChange_slider=(value)=>{
        onChange(value)
      }
      if(this.formRef.current){
        const fields = this.formRef.current.getFieldsValue()
        if(fields["search_term"][props.index]){
          const keys=fields["search_term"][props.index]["key"]
          const name=keys?keys[keys.length -1]:''
          if(keys && slider_flag[name]){
           return <Slider  getTooltipPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: 200, marginBottom: '0px' }} 
            tooltipVisible range={{ draggableTrack: true }} min={integer_min[name]} max={integer_max[name]} 
            onChange={handleChange_slider}
            //defaultValue={filter[name]}
            />
          } else
            return <Input
              //defaultValue={keys?(filter?filter[name]:''):''}
              style={{ width: 212 }}
              placeholder="value"
              onChange={handleChange_slider} />
        } else
        return <Input 
         style={{ width: 212}}  placeholder="value" onChange={handleChange_slider}/>
      }else
        return null
    }

    const SearchList = () => {
      return(
        <Form.List name="search_term" initialValue={[{}]}>
          {
            (fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField },index) => 
              {
                return(
                  <Space key={key} align="baseline" style={{ display: 'flex'}}  span={24}>
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                    >
                      {/*<Input placeholder="Search Field" />*/}
                      <Cascader
                        style={{ width: 200 }}
                        options={treeData}
                        onChange={onChange}
                        placeholder={t`Please choose the field`}
                        size={"middle"}
                        //defaultValue={Object.keys(filter)[name]||''}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                    >
                      {/*integerflag > 0 && <Input placeholder="value" />*/}
                      {/*integerflag < 0 && <Slider  getTooltipPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: 200 }} tooltipVisible range={{ draggableTrack: true }} defaultValue={[20, 50]} />*/}
                      <ValueInput index={index} ></ValueInput>
                    </Form.Item>

                    { fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
                    {index === fields.length - 1 && <PlusCircleOutlined onClick={() => add() } style={{}}/>}
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
