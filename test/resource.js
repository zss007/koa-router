/**
 * Resource tests
 */

var request = require('supertest');
var router = require('..');
var should = require('should');
var koa = require('koa');
var http = require('http');

describe('Resource', function() {
  it('should be exposed using `app.resource()`', function(done) {
    var app = koa();
    app.use(router(app));
    app.should.have.property('resource');
    app.resource.should.be.a('function');
    done();
  });

  it('should create new resource', function(done) {
    var app = koa();
    app.use(router(app));
    var resource = app.resource('forums', { index: function *() {} });
    resource.should.be.a('object');
    resource.should.have.property('name', 'forums');
    resource.should.have.property('id', 'forum');
    done();
  });

  it('should nest resources', function(done) {
    var app = koa();
    app.use(router(app));
    var forums = app.resource('forums', { index: function *() {} });
    var threads = app.resource('threads', { index: function *() {} });
    forums.add(threads);
    threads.base.should.equal('/forums/:forum/threads/');
    should.exist(app.routes.GET[2]);
    app.routes.GET[2].should.be.a('object');
    app.routes.GET[2].should.have.property('pattern', '/forums/:forum/threads/');
    done();
  });
});
