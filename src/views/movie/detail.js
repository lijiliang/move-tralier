import React, {Component} from 'react'
import Layout from '../../layouts/default'
import { request } from '../../lib'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Tabs, Card, Badge, Radio, Button, message, List, Avatar } from 'antd'

const DPlayer = window.DPlayer

moment.locale('zh-cn')
const TabPane = Tabs.TabPane

const site = 'http://p60z37jfd.bkt.clouddn.com/'  // 图片路径

function callback(key) {
  console.log(key);
}

export default class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      relativeMovies: [],
      _id: this.props.match.params.id,
      movie: null
    }
  }

  componentDidMount () {
    const _id = this.props.match.params.id
    this._getMovieDetail(_id)
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    const _id = this.props.match.params.id;
    if(_id !== nextProps.match.params.id){
      this._getMovieDetail(nextProps.match.params.id)
    }
}

  // 获取电影数据
  _getMovieDetail = (id) => {
    request({
      method: 'get',
      url: `/api/v0/movies/${id}`
    })
    .then(data => {
      const movie = data.movie
      const video = site + movie.videoKey
      const pic = site + movie.coverKey

      this.setState({
        movie: data.movie,
        relativeMovies: data.relativeMovies,
      }, () => {
        this.player = new DPlayer({
          container: document.getElementById('videoPlayer'),
          screenshot: true,
          autoplay: true,
          video: {
            url: video,
            pic: pic,
            thumbnails: pic
          }
        })
      })
    })
    .catch(() => {
      this.setState({
        movie: {}
      })
      this.props.history.goBack()
    })
  }

  render () {
    const { movie, relativeMovies } = this.state
    
    if (!movie) return null
    return (
      <div className="flex-row full">
        <div className="page-shade">
          <div className="video-wrapper">
            <div id="videoPlayer" data-src={site + movie.corerKey}
              data-video={site + movie.videokey} />
          </div>
          <div className="video-sidebar">
            <Link className="homeLink" to={'/'}>回到首页</Link>
            <Tabs defaultActiveKey='1' onChange={callback}>
              <TabPane tab="关于本片" key="1">
                  <h1>{movie.title}</h1>
                  <dl>
                    <dt>豆瓣评分：<Badge count={<span>{movie.rate}</span>} style={{ backgroundColor: '#52c41a' }} /> 分</dt>
                    <dt>电影分类：{movie.tags && movie.tags.join(' ')}</dt>
                    <dt>更新时间：{moment(movie.meta.createdAt).fromNow()}</dt>
                    <dt>影片介绍：</dt>
                    <dd>{movie.summary}</dd>
                  </dl>
              </TabPane>
              <TabPane tab="同类电影" key="2">
                {
                  relativeMovies.map(item => (
                    <Link key={item._id} className="media" to={`/detail/${item._id}`}>
                      <img width="60" className="align-self-center mr-3" src={site + item.posterKey} alt={item.rawTitle} />
                      <div className="media-body">
                        <h6 className="media-title">{item.title}</h6>
                        <ul className="list-unstyled">
                          {
                            item.pubdate && item.pubdate.map((it, i) => (
                              <li key={i}>{moment(it.date).format('YYYY.MM')} ({it.country})</li>
                            ))
                          }
                        </ul>
                      </div>
                    </Link>
                  ))
                }
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}