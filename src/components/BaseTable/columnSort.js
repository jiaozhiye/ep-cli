/*
 * @Author: 焦质晔
 * @Date: 2020-01-26 19:00:22
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-29 23:48:15
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Dropdown, Menu, Tree } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import classnames from 'classnames';
import css from './index.module.less';

const noop = () => {};

const deriveDataIndex = dataIndex => {
  return Array.isArray(dataIndex) ? dataIndex.join('|') : dataIndex;
};

export class ColumnSort extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired, // 列数据在数据项中对应的数组路径
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired // 列头显示文字
      })
    ),
    onChange: PropTypes.func
  };

  static defaultProps = {
    onChange: noop
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedKeys = nextProps.columns.filter(x => !x.hidden).map(x => deriveDataIndex(x.dataIndex));
    if (!_.isEqual(checkedKeys, prevState.checkedKeys)) {
      return { checkedKeys };
    }
    return null;
  }

  state = {
    checkedKeys: this.props.columns.map(x => deriveDataIndex(x.dataIndex))
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
    const res = this.props.columns.map(x => {
      if (checkedKeys.includes(deriveDataIndex(x.dataIndex))) {
        x.hidden = false;
      } else {
        x.hidden = true;
      }
      return x;
    });
    this.props.onChange(res);
  };

  onDrop = info => {
    // console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // sortable columns
    const data = [...this.props.columns];

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (deriveDataIndex(item.dataIndex) === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      return;
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.props.onChange(data);
  };

  createTreeItems = () => {
    return this.props.columns.map(x => {
      let { dataIndex, title } = x;
      if (Array.isArray(x.children) && x.children.length) {
        return (
          <Tree.TreeNode key={deriveDataIndex(dataIndex)} title={title}>
            {this.createTreeItems(x.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={deriveDataIndex(dataIndex)} title={title} />;
    });
  };

  popup = () => {
    const { checkedKeys } = this.state;
    return (
      <Menu>
        <Tree
          className={classnames(css['draggable-tree'])}
          defaultExpandAll
          checkable
          draggable
          blockNode
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
          onDrop={this.onDrop}
        >
          {this.createTreeItems()}
        </Tree>
      </Menu>
    );
  };

  render() {
    return (
      <Dropdown className={classnames(css['table-top-sort'])} overlay={this.popup()} trigger={['click']} overlayStyle={{ minWidth: 120 }}>
        <a href="#">
          <FilterOutlined /> 列筛选排序
        </a>
      </Dropdown>
    );
  }
}
