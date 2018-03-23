import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Card,
  Row,
  Col,
  Badge,
  Icon
} from 'antd'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const site = 'http://p60z37jfd.bkt.clouddn.com/'  // 图片路径
const Meta = Card.Meta 

export default class Content extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }
  _renderContent = () => {
    const {movies} = this.props

    return (
      <div style={{ padding: '30px'}}>
        <Row>
          {
            movies.map((it, i) => (
              <Col
                key={i}
                xl={{span: 6}}
                lg={{span: 8}}
                md={{span: 12}}
                sm={{span: 24}}
                style={{marginBottom: '8px'}}
              >
                <Card
                  bordered={false}
                  hoverable
                  style={{ width: '100%' }}
                  actions={[
                    <Badge>
                      <Icon style={{marginRight: '2px'}} type='clock-circle'/>
                      {moment(it.meta.createAt).fromNow(true)} 前更新
                    </Badge>,
                    <Badge>
                      <Icon style={{marginRight: '2px'}} type='star'/>
                      {it.rate} 分
                    </Badge>
                  ]}
                  cover={<img src={site + it.posterKey + '?imageMogr2/thumbnail/x1680/crop/1080x1600'} />}
                >
                  <Meta
                    style={{height: '202px', overflow: 'hidden'}}
                    title={<Link to={`/detail/${it._id}`}>{it.title}</Link>}
                    description={<Link to={`/detail/${it._id}`}>{it.summary}</Link>}
                  />
                </Card>
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }

  render () {
    return (
      <div style={{pading: 0}}>
        {this._renderContent()}
      </div>
    )
  }
}