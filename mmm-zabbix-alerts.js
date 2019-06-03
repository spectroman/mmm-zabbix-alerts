/* MMM2 Module */

/* spectroman's
 * Module: Zabbix Alerts
 *
 * By Spectroman https://juliochegedus.com
 * MIT Licensed.
 */

Module.register("mmm-zabbix-alerts",{

        // Default module config.
        defaults: {
                zbx_user: "GETYOUROWNUSER", // zabbix auth user
                abx_pass: "GETYOUROWNPASS", // zabbix auth pass
                updateInterval: 60 * 1000,  // every 1 min
                animationSpeed: 1000,
                listSize: 4,                // amount of items to check
                maxTitleSize: 40,           // title size
                fade: false,                // fade on rendering
                fadePoint: 0.25,            // Start on 1/4th of the list.
                initialLoadDelay: 2500,     // 2.5 seconds delay.
                retryDelay: 120000,           // wait for retry on fail
                apiSearch: "http://monitor.science.net/api_jsonrpc.php",
                triggerIds: [ "1234", "1234", "1234", "1234" ],
        },

        // Define required scripts.
        getScripts: function() {
                return ["moment.js"];

        },

        // Define required scripts.
        getStyles: function() {
                return ["zabbix-alerts.css"];
        },

        // Define start sequence.
        start: function() {
                Log.info("Starting module: " + this.name);

                this.loaded = false;
                this.scheduleUpdate(this.config.initialLoadDelay);
                this.updateTimer = null;
        },
        makeLogin: function() {
                var self = this;
                self.sendSocketNotification("LOGIN",{config: this.config});
        },

        socketNotificationReceived: function(notification, payload) {
          var self = this;
          if(notification === "GOT_TOKEN"){
            // this.fetchAlerts(payload.result);
            this.localToken = payload.result
            self.sendSocketNotification("TRIGGERS",{config: this.config, token: this.localToken});
          }
          if(notification === "GOT_TRIGGERS"){
            this.triggers = payload.result;
            self.sendSocketNotification("ALERTS",{config: this.config, token: this.localToken});
          }
          if(notification === "GOT_ALERTS"){
            this.problems = payload.result;
            this.buildResponse(this.problems,this.triggers);
            this.scheduleUpdate();
          }
          if(notification === "FAIL_TOKEN" || notification === "FAIL_TRIGGERS" || notification === "FAIL_ALERTS"){
            this.scheduleUpdate(this.config.retryDelay);
          }
        },

        buildResponse: function(problems,triggers) {
          var self = this;
          this.loaded = true;
          self.triggList = [];

          if (triggers.length > 0) {
            triggers.forEach(function(item) {
              var status='OK';
              if (problems.length > 0) {
                problems.forEach(function(itprob) {
                  if (item.triggerid == itprob.objectid) {
                    status = "Problemo"
                  }
                });
              }

              // canont explain why it only works like this, which is horrible!!!!!!!!!!
              if (self.triggList) {
                self.triggList.push({ name: item.description, id: item.triggerid, status: status });
              } else {
                self.triggList = [{ name: item.description, id: item.triggerid, status: status }]
              }
            });
          }
          this.updateDom(this.config.animationSpeed);
        },

        scheduleUpdate: function(delay) {
                var nextLoad = this.config.updateInterval;
                if (typeof delay !== "undefined" && delay >= 0) {
                        nextLoad = delay;
                }

                var self = this;
                clearTimeout(this.updateTimer);
                this.updateTimer = setTimeout(function() {
                        self.makeLogin();
                }, nextLoad);
        },


        // Override dom generator.
        getDom: function() {
                var table = document.createElement("table");
                var l = 0;
                while ( l  < this.config.listSize ) {

                    var trgr = this.triggList[l];

                    var row = document.createElement("tr");
                    table.appendChild(row);

                    var triggerA = document.createElement("td");
                    triggerA.className = trgr.status === "OK" ? "oktrigger" : "problemtrigger";
                    var triggerAValue = trgr.id+": "+trgr.name;
                    triggerA.innerHTML = triggerAValue;
                    row.appendChild(triggerA);

                    l++;
                    var trgr = this.triggList[l];

                    var triggerB = document.createElement("td");
                    triggerB.className = trgr.status === "OK" ? "oktrigger" : "problemtrigger";
                    var triggerAValue = trgr.id+": "+trgr.name;
                    triggerB.innerHTML = triggerAValue;
                    row.appendChild(triggerB);
                    l++;

                    if (this.config.fade && this.config.fadePoint < 1) {
                            if (this.config.fadePoint < 0) {
                                    this.config.fadePoint = 0;
                            }
                            var startingPoint = (this.triggList.length + 1) * this.config.fadePoint;
                            var steps = this.triggList.length - startingPoint;
                            if (l >= startingPoint) {
                                    var currentStep = l - startingPoint;
                                    row.style.opacity = 1 - (1 / steps * currentStep);
                            }
                    }

                }
                return table
        }
});
