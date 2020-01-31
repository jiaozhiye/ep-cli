/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 15:11:59
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-31 11:41:01
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Dropdown, Menu, Tree } from 'antd';

import classnames from 'classnames';
import css from './index.module.less';

const noop = () => {};

export class FormItemSort extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        fieldName: PropTypes.string.isRequired,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      })
    ),
    values: PropTypes.object.isRequired,
    style: PropTypes.object,
    onChange: PropTypes.func
  };

  static defaultProps = {
    onChange: noop
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedKeys = nextProps.items.filter(x => !x.hidden).map(x => x.fieldName);
    if (!_.isEqual(checkedKeys, prevState.checkedKeys)) {
      return { checkedKeys };
    }
    return null;
  }

  state = {
    checkedKeys: this.props.items.map(x => x.fieldName)
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
    const res = this.props.items.map(x => {
      if (checkedKeys.includes(x.fieldName)) {
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

    // sortable items
    const data = [...this.props.items];

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.fieldName === key) {
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

  getFormItemLabel = (val, list = []) => {
    return list.find(x => x.value === val).text;
  };

  createTreeItems = () => {
    return this.props.items.map(x => {
      let { fieldName, label } = x;
      label = _.isString(label) ? label : this.getFormItemLabel(this.props.values[label.fieldName], label.itemList);
      if (Array.isArray(x.children) && x.children.length) {
        return (
          <Tree.TreeNode key={fieldName} title={label}>
            {this.createTreeItems(x.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={fieldName} title={label} />;
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
    const { style } = this.props;
    return (
      <Dropdown overlay={this.popup()} trigger={['click']} overlayStyle={{ minWidth: 120 }}>
        <a href="#" style={{ ...style, paddingTop: 5, paddingBottom: 5 }}>
          排序
        </a>
      </Dropdown>
    );
  }
}
