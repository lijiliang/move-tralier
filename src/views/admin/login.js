import React, {Component} from 'react'
import Layout from '../../layouts/default'
import { request } from '../../lib'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { 
  Form,
  Icon,
  Input,
  Button
 } from 'antd'
const FormItem = Form.Item

@Form.create()
export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount () {

  }
  _toggleLoading = (status = false) =>{
    this.setState({
      loading: status
    })
  }

  _handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        request(this._toggleLoading)({
          method: 'post',
          url: '/admin/login',
          data: {
            ...values
          }
        }).then(res => {
          this.props.history.replace('/admin/list')
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form onSubmit={this._handleSubmit} className="login-form">
        <h3 style={{textAlign: 'center'}}>黑骑预告片后台</h3>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: '请输入邮箱!' }]
            })(
              <Input prefix={<Icon type='user' style={{ fontSize: 13 }} />} placeholder='邮箱' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }]
            })(
              <Input prefix={<Icon type='lock' style={{ fontSize: 13 }} />} type='password' placeholder='密码' />
            )}
          </FormItem>
          <FormItem>
            <Button style={{ width: '100%' }} htmlType='submit' loading={this.state.loading}>
              Log in
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}