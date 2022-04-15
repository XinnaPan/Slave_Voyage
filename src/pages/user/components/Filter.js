import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Trans } from "@lingui/macro"
import { t } from "@lingui/macro"
import { Slider,Button, Row, Col, DatePicker, Form, Input, Cascader, Tag , Space, AutoComplete } from 'antd'
import {  SearchOutlined,MinusCircleOutlined,PlusCircleOutlined } from '@ant-design/icons';
import  debounce from 'lodash.debounce';
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
  ValueInput = (props) =>{
    const { index ,
      AutoComplete_options,
      integer_min,
      integer_max,
      slider_flag,
      AutoComplete_onsearch,
      fields} =props
      if(fields["search_term"][index]){
        const keys=fields["search_term"][index]["key"]
        const name=keys?keys[keys.length -1]:''
        if(keys && slider_flag[name]){
         return <Slider  getTooltipPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: 200, marginBottom: '0px' }} 
          tooltipVisible range={{ draggableTrack: true }} min={integer_min[name]} max={integer_max[name]} 
          />
        } else {
          return <AutoComplete
            //options={AutoComplete_options}
            style={{
              width: 200,
            }}
            placeholder="input here"
            onChange ={(value)=>{
              const searchDebounce = debounce((value,name)=>AutoComplete_onsearch(value,name),500)
              searchDebounce(value,name)
            }}
          >
            {AutoComplete_options.map(item=>{
              return (<AutoComplete.Option value={item} key={item}>{item}</AutoComplete.Option>)}) }
            </AutoComplete>} 
      } else return <Input style={{ width: 212}}  placeholder="value" />
  }
  

  
  render() {
    const { onAdd, treeData, 
      handleSubmit, 
      handleClose,
      key_type, 
      onChange,
      integer_min,
      integer_max,
      slider_flag,
      AutoComplete_options,
      AutoComplete_onsearch
      } = this.props

    const submitAndClean=(e)=>{
      //handleSubmit(e);
      //this.handleReset();

      handleSubmit(e);
    }
    const searchDebounce = debounce(()=>AutoComplete_onsearch,500)

    
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
                      {
                        this.formRef.current?this.ValueInput({index,key_type,
                        AutoComplete_options,
                        integer_min,
                        integer_max,
                        slider_flag,
                        AutoComplete_onsearch,
                        fields: this.formRef.current.getFieldsValue()})
                        :<span />
                      }
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


export default Filter
