/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 21:07:45
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-29 13:07:38
 */
import React from 'react';
import { matchPath, Router, Switch, Route, Redirect } from 'react-router-dom';
import { AsyncLoadable } from '@/components';
import Nomatch from '@/pages/nomatch';

export const renderRoutes = (routes, extraProps = {}, switchProps = {}) => {
  return Array.isArray(routes) ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props => {
            const { pathname: path } = props.location;
            const { redirect } = deepMapRoutes(routes, path) || {};
            if (redirect) {
              return <Redirect from={path} to={redirect} />;
            }
            return route.render ? route.render({ ...props, ...extraProps, route }) : <route.component {...props} {...extraProps} route={route} />;
          }}
        />
      ))}
    </Switch>
  ) : null;
};

export const matchRoutes = (routes, pathname, branch = []) => {
  routes.some(route => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
      ? branch[branch.length - 1].match // use parent match
      : Router.computeRootMatch(pathname); // use default "root" match
    if (match) {
      branch.push({ route, match });
      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }
    return match;
  });
  return branch;
};

export const processRoutes = rs => {
  return rs.map(x => {
    if (Array.isArray(x.routes)) {
      // 处理 404
      x.routes.push({ path: '*', meta: { title: '404' }, component: Nomatch });
      x.routes = processRoutes(x.routes);
    }
    // component 必须是一个 类组件 或 函数式组件的声明，不可以是组件调用(<C />)
    // let component = !x.redirect ? x.component || AsyncLoadable(() => import(`@/pages/${x.page}`)) : () => <Redirect exact={x.exact} from={x.path} to={x.redirect} />;
    let component = x.component || AsyncLoadable(() => import(`@/pages/${x.page}`));
    return { ...x, component };
  });
};

export const deepMapRoutes = (rs, mark) => {
  let res = null;
  for (let i = 0; i < rs.length; i++) {
    if (Array.isArray(rs[i].routes)) {
      res = deepMapRoutes(rs[i].routes, mark);
    }
    if (res !== null) {
      return res;
    }
    if (rs[i].path === mark) {
      res = rs[i];
    }
  }
  return res;
};

export const flatMapRoutes = menus => {
  const res = [];
  menus.forEach(x => {
    if (Array.isArray(x.children)) {
      res.push(...flatMapRoutes(x.children));
    } else {
      res.push(x);
    }
  });
  return res;
};
