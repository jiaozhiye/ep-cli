/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-16 18:42:58
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import _ from 'lodash';

const noop = () => {};

export default (options = {}) => {
  return WrappedComponent => {
    class EditableTable extends Component {
      // displayName -> 定义调试时的组件 name
      static displayName = `HOC(${WrappedComponent.displayName || WrappedComponent.name})`;

      get editableColumns() {
        return this.getEditableColumns(this.props.columns);
      }

      getEditableColumns = memoizeOne(columns => {
        return this.createEditableColumns(columns);
      });

      // 创建 EditableTable 组件 columns
      createEditableColumns = columns => {
        return columns;
      };

      render() {
        const wrapProps = Object.assign({}, this.props, {
          columns: this.editableColumns
        });
        return <WrappedComponent {...wrapProps} />;
      }
    }
    return EditableTable;
  };
};
