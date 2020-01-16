/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:08:56
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-16 14:52:19
 */
import React, { Component, createRef } from 'react';
import classnames from 'classnames';
import css from './index.module.less';

import { Button } from 'antd';

import { BaseForm } from '@/components';
import { BaseTable } from '@/components';

import tableData from '@/mock/tableData';

import _ from 'lodash';

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
      }
    ],
    formType: 'search',
    values: { c: '2' },
    columns: [
      {
        dataIndex: 'date',
        title: '日期'
      },
      {
        dataIndex: ['person', 'name'],
        title: '姓名'
      },
      {
        dataIndex: ['person', 'sex'],
        title: '性别'
      },
      {
        dataIndex: 'price',
        title: '价格',
        precision: 2
      },
      {
        dataIndex: 'state',
        title: '状态',
        dictList: [
          { text: '已完成', value: 1 },
          { text: '处理中', value: 2 },
          { text: '未完成', value: 3 }
        ]
      }
    ],
    list: tableData.data.records
  };

  clickHandle = async (a, b) => {
    // const res = await this.formRef.current.GET_FORM_DATA();
    // console.log(res);
    this.formRef.current.SET_FIELDS_VALUE({ c: '1' });
    // this.setState(x => {
    //   return { values: { c: '1' } };
    // });
    this.setState(
      x => {
        const formList = x.formList;
        formList[1].rules = [{ required: true, message: 'Please input your username!' }];
        formList.push({
          type: 'INPUT',
          fieldName: 'h',
          label: '444'
        });
        return { formList };
      },
      () => {
        this.formRef.current.SET_FIELDS_VALUE({ h: 'asd' });
      }
    );
  };

  asdasd = () => {
    this.setState(x => {
      x.list[0].date = '2012-12-12 12:12:12';
      return {
        list: _.cloneDeep(x.list)
      };
    });
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
          onFormItemsChange={items => {
            this.setState(x => {
              return { formList: items };
            });
          }}
        />
        <div>
          <Button onClick={this.asdasd}>按钮</Button>
        </div>
        <BaseTable columns={this.state.columns} dataSource={this.state.list} />
      </div>
    );
  }
}

export default Dashboard;
