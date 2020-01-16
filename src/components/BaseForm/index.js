/*
 * @Author: 焦质晔
 * @Date: 2020-01-12 16:24:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-16 17:40:20
 */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import _ from 'lodash';
import config from '@/config';

import { FormItemSort } from './formItemSort';
import { Form, Button, Input, Select, Row, Col } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import classnames from 'classnames';
import css from './index.module.less';

const noop = () => {};

class BaseForm extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired, // 表单项类型
        fieldName: PropTypes.string.isRequired, // 字段名
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // label 标题
        rules: PropTypes.array, // 检验规则
        hidden: PropTypes.bool, // 隐藏该表单项，不占位
        invisible: PropTypes.bool, // 隐藏该表单项，占位
        style: PropTypes.object, // 表单元素的 css 样式
        desc: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // 表单元素描述部分
        disabled: PropTypes.bool, // 表单项是否禁用
        config: PropTypes.object, // 表单项的详细配置
        cols: PropTypes.number, // 表单项横跨的列数
        offset: PropTypes.number // 表单项向右侧便宜的列数
      })
    ), // 表单配置项列表
    initialValues: PropTypes.object, // 表单项的初始值
    cols: PropTypes.number, // 显示的列数
    labelCol: PropTypes.number, // 表单项 label 标签的宽度(栅格的列数)
    labelAlign: PropTypes.oneOf(['left', 'right']), // label 标签文本对齐方式
    formType: PropTypes.oneOf(['default', 'onlyShow', 'search']), // 表单类型
    isSubmitBtn: PropTypes.bool, // 是否显示表单提交按钮
    defaultRows: PropTypes.number, // 默认展示几行
    onValuesChange: PropTypes.func, // 表单组件，表单项的值更新时触发回调事件
    onFinish: PropTypes.func, // 提交表单且数据验证成功后回调事件
    onFinishFailed: PropTypes.func, // 提交表单且数据验证失败后回调事件
    onCollapse: PropTypes.func, // 展开/收起按钮状态改变时的回调事件
    onFormItemsChange: PropTypes.func // 表单配置项顺序变化时触发的回掉事件，和排序组件配合使用
  };

  static defaultProps = {
    cols: 4,
    labelCol: 6,
    labelAlign: 'right',
    formType: 'default',
    isSubmitBtn: false,
    defaultRows: 1,
    onValuesChange: noop,
    onFinish: noop,
    onFinishFailed: noop,
    onCollapse: noop,
    onFormItemsChange: noop
  };

  get formItems() {
    return this.getFormItems(this.props.formType);
  }

  get isCollapse() {
    return this.getIsCollapse(this.formItems);
  }

  get colSpan() {
    return 24 / this.props.cols;
  }

  constructor(props) {
    super(props);
    // form 组件实例
    this.formRef = createRef();
    this.formLayout = {
      labelCol: { span: this.props.labelCol },
      wrapperCol: { span: 24 - this.props.labelCol }
    };
    this.state = this.initialState();
  }

  // 初始化 state
  initialState = () => {
    const expand = false;
    const isParamsError = this.initialHandle();
    const currentValues = this.props.initialValues || {};
    return { expand, isParamsError, currentValues };
  };

  // 组件初始化方法，检查组件调用参数是否有误
  initialHandle = () => {
    const allFormItems = this.createFlatFormItems(this.props.items);
    const allFieldNames = [...new Set(allFormItems.map(x => x.fieldName))];
    if (allFieldNames.some(x => !x)) {
      return !this.warning(`配置项 fieldName 属性是必须参数，不能为空`);
    }
    if (allFieldNames.length !== allFormItems.length) {
      return !this.warning(`配置项 fieldName 属性是唯一的，不能重复`);
    }
    return false;
  };

  // 表单项的 label 标签
  createFormItemLabel = options => {
    if (_.isString(options)) {
      return options;
    }
    const { label, fieldName, type, itemList, style, disabled } = options;
    return (
      <Form.Item name={fieldName} noStyle>
        {type === 'SELECT' && (
          <Select style={style} disabled={disabled}>
            {itemList.map(x => (
              <Select.Option key={x.value} value={x.value}>
                {x.text}
              </Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
    );
  };

  // 表单项的布局
  createFormItemLayout = ({ cols = 1 }) => {
    const span = this.props.labelCol / cols;
    return {
      labelCol: { span },
      wrapperCol: { span: 24 - span }
    };
  };

  // INPUT 类型
  INPUT = options => {
    const {
      label,
      fieldName,
      rules = [],
      config,
      desc,
      placeholder = '请输入...',
      style,
      disabled,
      onInput = noop,
      onChange = noop,
      onPressEnter = noop
    } = options;
    return (
      <Form.Item label={this.createFormItemLabel(label)} {...this.createFormItemLayout(options)} required={this.getFormItemRequired(rules)}>
        <Form.Item name={fieldName} rules={rules} noStyle>
          <Input
            placeholder={placeholder}
            {...config}
            style={style}
            disabled={disabled}
            onInput={({ target: { value } }) => {
              onInput(value);
            }}
            onChange={({ target: { value } }) => {
              onChange(value);
            }}
            onPressEnter={({ target: { value } }) => {
              onPressEnter(value);
            }}
          />
        </Form.Item>
        {desc && <Form.Item noStyle>{desc}</Form.Item>}
      </Form.Item>
    );
  };

  // SELECT 类型
  SELECT = options => {
    const { label, fieldName, itemList, config, rules = [], desc, placeholder = '请选择...', style, disabled } = options;
    return (
      <Form.Item label={this.createFormItemLabel(label)} required={this.getFormItemRequired(rules)}>
        <Form.Item name={fieldName} rules={rules} noStyle>
          <Select placeholder={placeholder} {...config} style={style} disabled={disabled} allowClear>
            {itemList.map(x => (
              <Select.Option key={x.value} value={x.value}>
                {x.text}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {desc && <Form.Item noStyle>{desc}</Form.Item>}
      </Form.Item>
    );
  };

  // 获取表单项
  getFormItems = formType => {
    return this.props.items
      .map(x => {
        if (_.isObject(x.label)) {
          x.label.disabled = formType === 'onlyShow' ? true : x.label.disabled;
        }
        return {
          ...x,
          disabled: formType === 'onlyShow' ? true : x.disabled
        };
      })
      .filter(x => !x.hidden);
  };

  // 获取 展开/收起 状态
  getIsCollapse = arr => {
    return arr.length >= this.props.cols;
  };

  // 切换 展开/收起 状态
  setExpandHandle = () => {
    this.setState(
      prevState => {
        return { expand: !prevState.expand };
      },
      () => {
        this.props.onCollapse(this.state.expand);
      }
    );
  };

  // 表单布局
  createFormLayout = arr => {
    const { expand } = this.state;
    const { formType, defaultRows, cols } = this.props;
    const colsArr = [];
    arr.forEach(x => {
      const { offset = 0 } = x;
      for (let i = 0; i < offset; i++) {
        colsArr.push({});
      }
      colsArr.push(x);
    });
    const total = this.formItems.length;
    const defaultPlayRows = defaultRows > Math.ceil(total / cols) ? Math.ceil(total / cols) : defaultRows;
    const count = expand ? total : defaultPlayRows * cols - 1;
    const colFormItems = colsArr.map((x, i) => {
      const { fieldName, cols = 1 } = x;
      return (
        <Col key={i} span={cols * this.colSpan} style={formType === 'search' && { display: !this.isCollapse || i < count ? 'block' : 'none' }}>
          {fieldName && this.createFormItem(x)}
        </Col>
      );
    });
    return [...colFormItems, this.createSearchButtonLayout()];
  };

  // 顶部搜索类型按钮布局
  createSearchButtonLayout = () => {
    const { expand, currentValues } = this.state;
    const { formType, isSubmitBtn, defaultRows, cols, items, onFormItemsChange } = this.props;
    // 不是搜索类型
    if (formType !== 'search') return null;
    const total = this.formItems.length;
    let offset = defaultRows * cols - total > 0 ? defaultRows * cols - total - 1 : 0;
    if (!this.isCollapse || expand) {
      offset = cols - (total % cols) - 1;
    }
    return (
      isSubmitBtn && (
        <Col key={'-'} span={this.colSpan} offset={offset * this.colSpan} style={{ textAlign: 'right' }}>
          <Form.Item noStyle>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button htmlType="button" style={{ marginLeft: 8 }} onClick={this.RESET_FORM}>
              重置
            </Button>
            <FormItemSort
              items={items}
              values={currentValues}
              style={{ marginLeft: 8 }}
              onChange={list => {
                onFormItemsChange(list);
              }}
            />
            {this.isCollapse && (
              <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.setExpandHandle}>
                {expand ? <UpOutlined /> : <DownOutlined />} {expand ? '收起' : '展开'}
              </a>
            )}
          </Form.Item>
        </Col>
      )
    );
  };

  // 表单类型按钮列表
  createFormButtonLayout = () => {
    const { formType, isSubmitBtn } = this.props;
    return (
      isSubmitBtn &&
      formType !== 'onlyShow' && (
        <Row gutter={0}>
          <Col span={this.colSpan}>
            <Col offset={this.props.labelCol}>
              <Form.Item noStyle>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button htmlType="button" style={{ marginLeft: 8 }} onClick={this.RESET_FORM}>
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Col>
        </Row>
      )
    );
  };

  // 自定义渲染表单项
  renderFormItem = options => {
    const { label, fieldName, rules = [], desc, render = noop } = options;
    return (
      <Form.Item label={this.createFormItemLabel(label)} required={this.getFormItemRequired(rules)}>
        <Form.Item name={fieldName} rules={rules} noStyle>
          {render()}
        </Form.Item>
        {desc && <Form.Item noStyle>{desc}</Form.Item>}
      </Form.Item>
    );
  };

  // 表单元素
  createFormItem = x => {
    if (!_.isFunction(this[x.type])) {
      return this.warning(`配置项 ${x.fieldName} 的 type 类型错误`);
    }
    return !x.invisible ? (x.render ? this.renderFormItem(x) : this[x.type](x)) : null;
  };

  // 表单控件，表单项值变化的事件
  formValueChange = (changedValues, allValues) => {
    this.setState(prevState => {
      return { currentValues: Object.assign({}, prevState.currentValues, changedValues) };
    });
    this.props.onValuesChange(changedValues, allValues);
  };

  // 提交表单且数据验证成功的事件
  submitFinish = values => {
    this.props.onFinish(values);
  };

  // 提交表单且数据验证失败的事件
  submitFinishFailed = ({ values, errorFields }) => {
    this.formRef.current.scrollToField(errorFields[0].name);
    this.props.onFinishFailed(errorFields);
  };

  // 获取表单项是否有必填校验
  getFormItemRequired = (rules = []) => {
    return rules.some(x => x.required);
  };

  // 展平表单配置项
  createFlatFormItems = arr => {
    const res = [];
    arr.forEach(x => {
      const target = { ...x };
      if (_.isObject(target.label)) {
        res.push(target.label);
        delete target.label;
      }
      res.push(target);
    });
    return res;
  };

  // 提示错误信息
  warning = msg => {
    return console.error(`Warning: [BaseForm] ${msg}`);
  };

  /* 公开外部方法 */

  // 提交表单
  SUBMIT_FORM = () => {
    this.formRef.current.submit();
  };

  // 重置表单
  RESET_FORM = () => {
    this.formRef.current.resetFields();
  };

  // 设置表单项的值，参数是表单值得集合 { fieldName: val, ... }
  SET_FIELDS_VALUE = values => {
    this.formRef.current.setFieldsValue(values);
  };

  // 获取表单的值，异步方法，错误前置的原则
  GET_FORM_DATA = async () => {
    try {
      const res = await this.formRef.current.validateFields();
      return [null, res];
    } catch ({ errorFields }) {
      this.formRef.current.scrollToField(errorFields[0].name);
      return [errorFields, null];
    }
  };

  render() {
    const { isParamsError } = this.state;
    const { initialValues, formType } = this.props;
    return (
      !isParamsError && (
        <div className={classnames(css['base-form'])}>
          <Form
            ref={this.formRef}
            size={config.moduleSize}
            {...this.formLayout}
            initialValues={initialValues}
            onValuesChange={this.formValueChange}
            onFinish={this.submitFinish}
            onFinishFailed={this.submitFinishFailed}
            onSubmit={ev => ev.preventDefault()}
          >
            <Row gutter={0}>{this.createFormLayout(this.formItems)}</Row>
            {formType !== 'search' && this.createFormButtonLayout()}
          </Form>
        </div>
      )
    );
  }
}

export default BaseForm;
