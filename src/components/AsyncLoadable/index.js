/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 15:28:58
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-02 12:34:55
 */
import React, { Component } from 'react';
import { Spin } from 'antd';
import css from './index.module.less';

const AsyncLoadable = importComponent => {
  return class Loadable extends Component {
    state = {
      component: null
    };

    async componentDidMount() {
      let { default: component } = await importComponent();
      this.setState({ component });
    }

    render() {
      const { component: C } = this.state;
      return C ? (
        <C {...this.props} />
      ) : (
        <div className={css.spin}>
          <Spin size="large" />
        </div>
      );
    }
  };
};

export default AsyncLoadable;
