/*
 * @Author: 焦质晔
 * @Date: 2020-01-29 22:42:48
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-08 13:44:09
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
          title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired, // 列头显示文字
          width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // 列宽度 值 audo 表示自适应宽度
          fixed: PropTypes.oneOf(['left', 'right']), // 列固定（IE 下无效）
          align: PropTypes.oneOf(['left', 'center', 'right']), // 设置列的对齐方式
          ellipsis: PropTypes.bool, // 超过宽度将自动省略
          className: PropTypes.string, // 列样式类名
          sorter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]), // 列排序
          filter: PropTypes.shape({
            type: PropTypes.oneOf(['text', 'checkbox', 'radio', 'number', 'range-number', 'date', 'range-date']).isRequired, // 列筛选类型
            items: PropTypes.array // 筛选列表项
          }),
          precision: PropTypes.number, // 数值类型字段的精度
          dictList: PropTypes.arrayOf(
            PropTypes.shape({
              text: PropTypes.string,
              value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            })
          ),
          formatType: PropTypes.oneOf(['date', 'datetime', 'finance', 'secret-name', 'secret-phone']), // 字段的格式化类型
          summation: PropTypes.shape({
            dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 服务端合计的数据字段名，建议和 column 的 dataIndex 一致
            unit: PropTypes.string // 合计字段的单位
          })
        })
      ),
      dataSource: PropTypes.array, // 数据数组
      fetch: PropTypes.shape({
        api: PropTypes.func, // 请求数据列表的 ajax 接口
        params: PropTypes.object // 请求参数
      }),
      datakey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 接口返回的数据数组对应的数组路径
      uidkey: PropTypes.string, // 行数据的 uuid 字段名
      size: PropTypes.oneOf(['middle', 'small']), // 表格大小
      bordered: PropTypes.bool, // 是否展示外边框和列边框
      showHeader: PropTypes.bool, // 是否显示表头
      showPagination: PropTypes.bool, // 是否显示分页
      rowSelection: PropTypes.shape({
        type: PropTypes.oneOf(['checkbox', 'radio']), // 多选/单选，checkbox/radio，默认 checkbox
        selectedRowKeys: PropTypes.array.isRequired, // 选中项的 key 数组
        disabledRowKeys: PropTypes.array, // 禁止选中项的 key 数组
        onChange: PropTypes.func.isRequired // 选中项发生变化时的回调
      }),
      expandable: PropTypes.shape({
        expandedRowRender: PropTypes.func, // 展开行渲染方法，返回 JSX 节点，可实现嵌套子表格
        onExpand: PropTypes.func // 点击展开图标时触发
      }),
      onColumnsChange: PropTypes.func.isRequired, // 表格列 顺序/显示隐藏 变化时的回调
      moreActions: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired, // 更多操作列表文字
          onClick: PropTypes.func // 列表的点击事件
        })
      ),
      extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // 表格顶部的按钮区域
      scroll: PropTypes.shape({
        x: PropTypes.any, // 设置横向滚动
        y: PropTypes.any // 设置纵向滚动
      })
    };

    static defaultProps = {
      dataSource: [],
      fetch: {},
      datakey: 'records',
      uidkey: 'uid',
      size: 'middle',
      bordered: true,
      showPagination: true
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
