利用koa和puppeteer抓取数据开发的一个电影预告片网站

## 本地开发
确保本地开启了mongodb
```
npm install 
npm start
```

## 线上发布

需要开启mongodb

```
pm2 deploy ecosystem.json production setup
pm2 deploy ecosystem.json production  
```

## Nginx 配置
movie-xxxx.com.conf
```
// 负载均衡
upstream moveTralier {
  server 127.0.0.1:3098;
}

server {
  listen 80;
  server_name movie-xxxx.com;

  location / {
    root /home/website/move-tralier/current/dist;
    index index.html;
  }

  location /api {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;

    proxy_pass http://moveTralier;
    proxy_redirect off;
  }

  location ~* ^.+\.(html|jpg|jpeg|gif|png|ico|css|js|pdf|txt) {
    root /home/website/move-tralier/current/dist;
  }

  access_log /www/nginx_logs/moveTralier.log;
}
```