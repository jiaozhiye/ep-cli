/*
 * @Author: 焦质晔
 * @Date: 2019-12-01 09:26:53
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-01 09:37:55
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const DictHOC = WrappedComponent => {
  return class HOC extends Component {
    // displayName -> 定义调试时的组件 name
    static displayName = `HOC(${WrappedComponent.displayName || WrappedComponent.name})`;

    static propTypes = {};

    static defaultProps = {};

    createDictList = () => { };

    createDictText = () => { };

    render() {
      return <WrappedComponent {...this.props} createDictList={this.createDictList} createDictText={this.createDictText} />
    }
  };
}

export default DictHOC;
