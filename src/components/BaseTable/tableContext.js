/*
 * @Author: 焦质晔
 * @Date: 2020-01-29 22:42:48
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-30 22:44:28
 */
import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';

export const TableContext = createContext();

export default WrappedComponent => {
  class ContextProvider extends Component {
    static propTypes = {
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired, // 列数据在数据项中对应的数组路径
          title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired // 列头显示文字
        })
      ),
      dataSource: PropTypes.array, // 数据数组
      fetch: PropTypes.shape({
        api: PropTypes.func, // 请求数据列表的 ajax 接口
        params: PropTypes.object // 请求参数
      }),
      datakey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 接口返回的数据数组对应的数组路径
      uidkey: PropTypes.string, // 行数据的 uuid 字段名
      rowSelection: PropTypes.shape({
        type: PropTypes.string, // 多选/单选，checkbox/radio，默认 checkbox
        selectedRowKeys: PropTypes.array.isRequired, // 选中项的 key 数组
        disabledRowKeys: PropTypes.array, // 禁止选中项的 key 数组
        onChange: PropTypes.func.isRequired // 选中项发生变化时的回调
      }),
      sorter: PropTypes.bool, // 列排序
      filter: PropTypes.shape({
        type: PropTypes.string.isRequired, // 列筛选类型 text/checkbox/radio/number/range-number/date/range-date
        items: PropTypes.array // 筛选列表项
      }),
      expandable: PropTypes.shape({
        expandedRowRender: PropTypes.func, // 展开行渲染方法，返回 JSX 节点，可实现嵌套子表格
        onExpand: PropTypes.func // 点击展开图标时触发
      }),
      onColumnsChange: PropTypes.func.isRequired // 表格列 顺序/显示隐藏 变化时的回调
    };

    static defaultProps = {
      dataSource: [],
      datakey: 'records',
      uidkey: 'uid',
      fetch: {}
    };

    state = {
      total: this.props.dataSource.length
    };

    // 改变分页 total
    changeTotalHandle = val => {
      this.setState({ total: Number(val) });
    };

    render() {
      const { forwardedRef, ...rest } = this.props;
      const wrapProps = Object.assign({}, rest);
      const contextValue = {
        total: this.state.total,
        onTotalChange: this.changeTotalHandle
      };
      return (
        <TableContext.Provider value={contextValue}>
          <WrappedComponent ref={forwardedRef} {...wrapProps} />
        </TableContext.Provider>
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <ContextProvider {...props} forwardedRef={ref} />;
  });
};
