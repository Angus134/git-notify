# koa-log-requests

Customizable Koa middleware for logging incoming requests.
Outputs method, path, response status, time spent and request body.


### Installation

```
$ npm install koa-log-requests --save
```


### Usage

```javascript
var koa = require('koa');
var requests = require('koa-log-requests');

var app = koa();

app.use(requests());
app.use(function * (next) {
	this.body = 'Hello World';
	
	yield next;
});

app.listen(3000);
```

![](http://cl.ly/image/3D1o3m2Q3Z0x/direct)


#### Options

There are few options, that you can customize:

```javascript
var requests = require('koa-log-requests');

requests.indent = 2; // insert N spaces at the beginning
requests.format = ':method :path status=:status time=:time body=:body'; // format of output
requests.filter = ['password', 'password_confirmation']; // filter out these keys from request body
```


### License

koa-log-requests is released under the MIT license.
