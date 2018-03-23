import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Button,
  Card,
  Tag,
  Row,
  Col,
  Spin,
  Modal,
  Badge,
  Icon
} from 'antd'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const site = 'http://p60z37jfd.bkt.clouddn.com/'  // 图片路径
const Meta = Card.Meta 

const DPlayer = window.DPlayer

export default class Content extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false
    }
  }
  _handleClose = (e) => {
    if (this.player && this.player.pause) {
      this.player.pause()
    }
  }
  _handleCancel = (e) => {
    this.setState({
      visible: false
    })
  }

  // 跳到详情页
  _jumpToDetail = () => {
    const { url } = this.props

    url && window.open(url)
  }

  _showModel = (movie) => {
    this.setState({
      visible: true
    })
    const video = site + movie.videoKey
    const pic = site + movie.coverKey

    // 视频
    if (!this.player) {
      setTimeout(() => {
        this.player = new DPlayer({
          container: document.getElementsByClassName('videoModal')[0],
          screenshot: true,
          autoplay: true,
          video: {
            url: video,
            pic: pic,
            thumbnails: pic
          }
        })
      }, 500)
    } else {
      if (this.player.video.currentSrc !== video) {
        this.player.switchVideo({
          url: video,
          autoplay: true,
          pic: pic,
          type: 'auto'
        })
      }

      this.player.play()
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
                  cover={<img onClick={() => this._showModel(it)} src={site + it.posterKey + '?imageMogr2/thumbnail/x1680/crop/1080x1600'} />}
                >
                  <Meta
                    style={{height: '202px', overflow: 'hidden'}}
                    title={<Link to={`/detail/${it._id}`}>{it.title}</Link>}
                    description={<Link to={`/detail/${it._id}`}>{it.summary}</Link>}
                    onClick={() => this._jumpToDetail}
                  />
                </Card>
              </Col>
            ))
          }
        </Row>
        <Modal
          className="videoModal"
          footer={null}
          visible={this.state.visible}
          afterClose={this._handleClose}
          onCancel ={this._handleCancel}
        >
          <Spin size='large' />
        </Modal>
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