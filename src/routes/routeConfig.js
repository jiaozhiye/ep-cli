/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 21:07:45
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-24 10:49:54
 */
import React from 'react';
import { matchPath, Router, Switch, Route, Redirect } from 'react-router-dom';
import { AsyncLoadable } from '@/components';

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
      x.routes = processRoutes(x.routes);
    }
    // component 必须是一个类组建或函数式组件的声明，不可以是组件调用(<C />)
    let component = !x.redirect ? x.component || AsyncLoadable(() => import(`@/pages/${x.page}`)) : () => <Redirect exact={x.exact} from={x.path} to={x.redirect} />;
    return { ...x, component };
  });
};
