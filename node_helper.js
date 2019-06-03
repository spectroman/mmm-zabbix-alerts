var request = require('request');
var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

        start: function() {
                console.log("Starting node helper: " + this.name);
        },

        socketNotificationReceived: function(notification, payload) {
          var self = this;

          var triggers_list='';

          console.log("ZBX received signal: " + notification + " Using: "+ payload.config.apiSearch);

          if(notification === "LOGIN"){
            var zabbixUri = payload.config.apiSearch;
            var body = { jsonrpc: '2.0', method: 'user.login', params: {
                         user: payload.config.zbx_user, password: payload.config.zbx_pass },
                         id: '1' };
            request.post({
                uri: zabbixUri,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
              }, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                self.sendSocketNotification("GOT_TOKEN", JSON.parse(body));
              } else {
                console.log("ZBX Failed to Login response: "+response.statusCode);
                self.sendSocketNotification("FAIL_TOKEN", JSON.parse(body));
              }
            });
          }

          if(notification === "TRIGGERS"){
            var zabbixUri = payload.config.apiSearch;
            var bodytgr = { jsonrpc: '2.0', method: 'trigger.get', params: {
                            triggerids: payload.config.triggerIds},
                            auth: payload.token, id: '1' };
            request.post({
                uri: zabbixUri,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bodytgr)
              }, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                self.sendSocketNotification("GOT_TRIGGERS", JSON.parse(body));
              } else {
                console.log("ZBX Failed to get triggers response: "+response.statusCode);
                self.sendSocketNotification("FAIL_TRIGGERS", JSON.parse(body));
              }
            });
          }

          if(notification === "ALERTS"){
            var zabbixUri = payload.config.apiSearch;
            var bodyalert = { jsonrpc: '2.0', method: 'problem.get', params: {
                              output: 'extend',
                              objectids: payload.config.triggerIds,
                              sortorder: 'DESC' },
                              auth: payload.token, id: '1' };
            request.post({
                uri: zabbixUri,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bodyalert)
              }, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                self.sendSocketNotification("GOT_ALERTS", JSON.parse(body));
              } else {
                console.log("ZBX Failed to get alerts response: "+response.statusCode);
                self.sendSocketNotification("FAIL_ALERTS", JSON.parse(body));
              }
            });
          }
      },


});
