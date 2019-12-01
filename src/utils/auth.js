/*
 * @Author: 焦质晔
 * @Date: 2019-12-01 09:39:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-01 09:41:51
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// 高阶组件：是一个函数，能够接收一个组件，并返回一个新的组件，
// 通过高阶组件，可以把通用的逻辑数据或方法注入到被其装饰的基础组件中
// 用途：重用组件逻辑，对参数组件进行包装和扩展，注入一些特定的功能

const AuthHOC = options => {
  // 处理 options 参数
  // ...
  return WrappedComponent => {
    return class HOC extends Component {
      // displayName -> 定义调试时的组件 name
      static displayName = `HOC(${WrappedComponent.displayName || WrappedComponent.name})`;

      static propTypes = {};

      static defaultProps = {};

      render() {
        return <WrappedComponent {...this.props} />
      }
    };
  }
}

export default AuthHOC;
