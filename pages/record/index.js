//index.js
var app = getApp();
Page({
	data: {
    history: []
  },
	onLoad: function () {
    var history = wx.getStorageSync('todos_history');
    var rage = [];
    for (var i = 0; i < history.length; i++) {
      var todos = history[i].todos;
      var completed = 0;
      for (var j = 0; j < todos.length; j++) {
        if (todos[j].completed) {
          completed++;
        }
      }
      history[i].rage = completed + '/' + todos.length;
    }

    this.setData({
      history
    })
  },
})