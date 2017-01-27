//index.js
import {
  formatTime,
  formatDate
} from '../../utils/util';

var app = getApp();
var TODAY = formatDate(new Date());

Page({
  data: {
    todos: [],
    allCompleted: true,
    input: '',
    userInfo: {}
  },

  save: function() {
    var todos_history = wx.getStorageSync('todos_history');
    var j = 0;

    if (typeof todos_history != 'object') {
      todos_history = [];
    }

    for (var i = 0; i < todos_history.length; i++) {
      if (todos_history[i].date == TODAY) {
        todos_history[i].todos = this.data.todos;
      } else {
        j++;
      }
    }

    if(j == todos_history.length) {
      todos_history.push({
        date: TODAY,
        todos: this.data.todos
      })
    }

    wx.setStorageSync('todos_history', todos_history);
  },

  onLoad: function () {
    var that = this;
    var todos_history = wx.getStorageSync('todos_history');
    var todos = [];

    for (var i = 0; i < todos_history.length; i++) {
      if (todos_history[i].date == TODAY) {
        todos = todos_history[i].todos;
      }
    }

    if (todos) {
      app.getUserInfo(function(userInfo) {
        that.setData({
          userInfo,
          todos
        })
        that.save();
      })
    }
  },

  handleInput: function(e) {
    this.setData({
      input: e.detail.value
    })
  },

  todoAdd: function () {
    var {
      todos,
      input
    } = this.data;
    var length = todos.length;
    if (!input || !input.trim()) {
      return 0;
    }
    var date = new Date();
    var time = formatTime(date);
    todos.push({
      index: length + 1,
      value: input,
      time: time,
      completed: false
    })
    this.setData({
      todos,
      input: ''
    })
    this.save();
  },

  todoChange: function(e) {
    var todos = this.data.todos, values = e.detail.value;
    for (var i = 0; i < todos.length; i++) {
        todos[i].completed = false;

        for (var j = 0; j < values.length; j++) {
            if (todos[i].index == values[j]) {
                todos[i].completed = true;
                break;
            }
        }
    }
    var allCompleted = this.data.allCompleted;
    if (todos.length === values.length) {
      allCompleted = false;
    } else if (values.length === 0) {
      allCompleted = true;
    } else {
      //do nothing
    }
    
    this.setData({
      todos,
      allCompleted
    })
    this.save();
  },

  handleAll: function() {
    var {
      todos,
      allCompleted
    } = this.data;
    for (var i = 0; i < todos.length; i++) {
        todos[i].completed = allCompleted
    }
    this.setData({
      todos,
      allCompleted: !allCompleted
    })
    this.save();
  },

  clearCompleted: function() {
    var that = this;

    var {
      todos,
    } = that.data;
    var remain = todos.filter(function(todo) {
      return todo.completed === false;
    });

    if (remain.length < todos.length) {
      wx.showModal({
        title: '提示',
        content: '清空已完成的Todos？',
        success: function(res) {
          if (res.confirm) {

            that.setData({
              todos: remain
            })
            that.save();
          }
        }
      });
    }
  }
})
