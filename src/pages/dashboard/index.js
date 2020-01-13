/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:08:56
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-13 21:51:13
 */
import React, { Component, createRef } from 'react';
import classnames from 'classnames';
import css from './index.module.less';

import { Button } from 'antd';

import { BaseForm } from '@/components';

class Dashboard extends Component {
  formRef = createRef();

  state = {
    formList: [
      {
        type: 'INPUT',
        fieldName: 'a',
        label: 'aaa',
        rules: [{ required: true, message: 'Please input your username!' }],
        style: { width: 'calc(100% - 40px)', marginRight: '5px' },
        desc: 'kg',
        config: {
          // prefix: '$',
          // suffix: '元/天',
          // addonAfter: 'asd',
          // readOnly: true
        },
        onPressEnter: val => {
          console.log(val);
        }
      },
      {
        type: 'INPUT',
        fieldName: 'b',
        label: {
          type: 'SELECT',
          fieldName: 'c',
          style: { width: '90px' },
          itemList: [
            { text: 'aaa', value: '1' },
            { text: 'bbb', value: '2' }
          ]
        }
      },
      {
        type: 'SELECT',
        fieldName: 'd',
        label: 'ccc',
        itemList: [
          { text: 'aaa', value: '1' },
          { text: 'bbb', value: '2' }
        ]
      },
      {
        type: 'INPUT',
        fieldName: 'e',
        label: '111'
      },
      {
        type: 'INPUT',
        fieldName: 'f',
        label: '222'
      },
      {
        type: 'INPUT',
        fieldName: 'g',
        label: '333'
      },
      {
        type: 'INPUT',
        fieldName: 'h',
        label: '444'
      }
    ],
    formType: 'search',
    values: { c: '2' }
  };

  clickHandle = async (a, b) => {
    // const res = await this.formRef.current.GET_FORM_DATA();
    // console.log(res);
    this.formRef.current.SET_FIELDS_VALUE({ c: '1' });
    // this.setState(x => {
    //   return { values: { c: '1' } };
    // });
    // this.setState(x => {
    //   const formType = 'show';
    //   const formList = x.formList;
    //   formList[1].rules = [{ required: true, message: 'Please input your username!' }];
    //   return { formType, formList };
    // });
  };

  render() {
    return (
      <div>
        <BaseForm
          ref={this.formRef}
          items={this.state.formList}
          isSubmitBtn={true}
          formType={this.state.formType}
          initialValues={this.state.values}
        />
        <Button type="primary" onClick={this.clickHandle}>
          Primary
        </Button>
      </div>
    );
  }
}

export default Dashboard;
