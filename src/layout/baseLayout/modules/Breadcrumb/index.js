/*
 * @Author: 焦质晔
 * @Date: 2019-11-24 11:05:38
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-24 11:22:37
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { matchRoutes } from '@/routes/routeConfig';
import routes from '@/routes';
import classnames from 'classnames';
import css from './index.module.less';

@withRouter
class Breadcrumb extends Component {
  state = {
    result: []
  };

  componentDidMount() {
    const { pathname: path } = this.props.location;
    console.log(matchRoutes(routes, path));
  }

  render() {
    return <div>面包屑</div>;
  }
}

export default Breadcrumb;
