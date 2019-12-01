/*
 * @Author: 焦质晔
 * @Date: 2019-12-01 09:26:53
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-01 13:06:55
 */
import React, { Component } from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '@/store/actions';

const getLocalDict = () => {
  return JSON.parse(localStorage.getItem('dict'));
};

export default WrappedComponent => {
  @connect(
    state => ({ dict: state.app.dict }),
    dispatch => ({})
  )
  class Dict extends Component {
    // displayName -> 定义调试时的组件 name
    static displayName = `HOC(${WrappedComponent.displayName || WrappedComponent.name})`;

    state = {
      dictData: getLocalDict() || this.props.dict
    }

    /**
     * @description 创建数据字典列表数组
     * @param {Number} code 字典项的 key
     * @param {Array} vals 需要滤掉的字典项，有 code 组成
     * @return {Array} 数据字典列表
     */
    createDictList = (code, vals = []) => {
      const { dictData: dict } = this.state;
      vals = Array.isArray(vals) ? vals : [vals];
      let res = [];
      if (_.isObject(dict) && Array.isArray(dict[code])) {
        res = dict[code].map(x => ({ text: x.codeCnDesc, value: x.codeId }));
        res = res.filter(x => !vals.includes(x.value));
      }
      return res;
    };

    /**
     * @description 创建数据字典列表数组
     * @param {Number} code 字典项的 key
     * @param {String|Number} val 字典项的值
     * @return {String} 数据字典项对应的文本
     */
    createDictText = (code, val) => {
      const { dictData: dict } = this.state;
      let res = '';
      if (!val) return res;
      if (_.isObject(dict) && Array.isArray(dict[code])) {
        const target = dict[code].find(x => x.codeId === val);
        res = target ? target.codeCnDesc : val;
      }
      return res;
    };

    /**
     * @description 创建省市区的字典数据
     * @return {String} 返回省市区的递归结构数据列表
     */
    createDictRegion = () => {
      const { dictData: dict } = this.state;
      return this.deepFunc(dict['region']);
    };

    deepRegion = (data) => {
      const res = [];
      for (let key in data) {
        const target = { value: data[key]['regionCode'], text: data[key]['regionName'] };
        if (_.isObject(data[key].children) && Object.keys(data[key].children).length) {
          target.children = this.deepRegion(data[key].children);
        }
        res.push(target);
      }
      return res;
    }

    render() {
      return <WrappedComponent {...this.props} createDictList={this.createDictList} createDictText={this.createDictText} />
    }
  };
  return Dict;
}
