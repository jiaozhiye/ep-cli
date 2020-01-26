/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-26 23:12:06
 */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import _ from 'lodash';

const noop = () => {};

export default (options = {}) => {
  return WrappedComponent => {
    class EditableTable extends Component {
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
        const { forwardedRef, ...rest } = this.props;
        const wrapProps = Object.assign({}, rest, {
          editableTableRef: this,
          columns: this.editableColumns
        });
        return <WrappedComponent ref={forwardedRef} {...wrapProps} />;
      }
    }

    return React.forwardRef((props, ref) => {
      return <EditableTable {...props} forwardedRef={ref} />;
    });
  };
};
