# Magic Mirror Module: mmm-zabbix-alerts
This [MagicMirror2](https://github.com/MichMich/MagicMirror) module allows you to download JSON and show alerts from Zabbix API

## Installation

In your terminal, go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/spectroman/mmm-zabbix-alerts.git
````

Configure the module in your `config.js` file.

## Using the module

Now add the module to the modules array in the `config/config.js` file:
````javascript
                {
                        module: 'mmm-zabbix-alerts',
                        position: 'top_left',
                        header: 'Zabbix Alerts',
                        config: {
                                apiSearch: "http://monitor.domain.net/api_jsonrpc.php"
                                zbx_user: "admin", // after creating a user there u can access
                                zbx_pass: "admin", // user a password for the remote user
                                listSize: 4,
                                triggerIds: [ "1234", "1234", "1234", "1234" ] // for each trigger there is a status block
                        }
                },
````

## Configuration options

The following properties can be configured:


<table width="100%">
        <!-- why, markdown... -->
        <thead>
                <tr>
                        <th>Option</th>
                        <th width="100%">Description</th>
                </tr>
        <thead>
        <tbody>
                <tr>
                        <td><code>apiSearch</code></td>
                        <td>API URL from zabbix to consult</td>
                </tr>
                <tr>
                        <td><code>zbx_user</code></td>
                        <td>UserName on the zabbix server</td>
                </tr>
                <tr>
                        <td><code>zbx_pass</code></td>
                        <td>Password for user on the zabbix server</td>
                </tr>
                <tr>
                        <td><code>listSize</code></td>
                        <td>Amount of triggers to show</td>
                </tr>
                <tr>
                        <td><code>triggerIds</code></td>
                        <td>Trigger ids to collect information from zabbix</td>
                </tr>
        </tbody>
</table>
