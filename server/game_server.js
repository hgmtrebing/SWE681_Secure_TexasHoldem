var https = require('https');
const fs = require ('fs');

const Log = require("./log").Log;
const Table = require('./table').Table;
const Status = require('./definition').Status;

function GameServer (server) {
	this.log = new Log();
	this.tables = [];
	this.users = {};
	this.server = server;
	this.tableCounter = 1;//table starts with 1
	this.tableLimit = 10;
	this.mainLoopRunning = false;
	this.tableUrl = "table.html";
	this.homePage = "home_page";
	this.io = require('socket.io')(server);

	/**
	 * Creates a new Table with a new Table ID, provided the number of tables
	 */
	this.createTable = function () {
		if (this.tables.length < this.tableLimit) {
			var newTable = new Table(this.tableCounter, this);
			this.tables.push(newTable);
			this.log.logSystem("Table created, with ID: " + this.tableCounter);
			this.tableCounter++;
			return {result: true, id: newTable.tableId};
		}
		this.log.logSystem("Table could not be created, since the number of current tables ( " + this.tables.length + " ) is at the limit on tables ( " + this.tableLimit + " )");
		return {result: false, id: null};
	};

	/**
	 * Deletes the table with a matching tableId, provided that table is completely empty
	 * @param tableId - the tableId of the table to delete
	 */
	this.deleteTable = function (tableId) {
		for (let i = 0; i < this.tables.length; i++) {
			if (this.tables[i].tableId === tableId && this.tables[i].getNumberOfPlayers(Status.EMPTY, true) === 6){
				this.tables.splice(i, 1);
				this.log.logSystem("Table #" + tableId + " has been deleted");
			}
			this.log.logSystem("Table #" + tableId + " delete attempt has failed, either because the Table ID could not be found or because the Table was not completely empty");
		}
	};

	/**
	 * Returns a Table object with a matching TableId, or null if TableId could not be found in TableManager
	 * @param tableId - the TableId of the Table to get
	 * @returns {*}
	 */
	this.getTable = function (tableId) {		
		for (let i = 0; i < this.tables.length; i++) {
			if (this.tables[i].tableId === tableId) {
				return this.tables[i];
			}
		}
	};


	/**
	 * Validates Inbound Messages
	 */
	this.validateMessage = function (msg) {
		// Validate user and token
		// Validate against input whitelist
		// return true or false
		return true;
	};

	this.start = function() {
		setInterval(this.mainLoop, 500, this);
	};

	this.createHomePageUpdateMessage = function() {
		var tableArray = [];
		for (let i = 0; i < this.tables.length; i++) {
			tableArray.push({
				tableId: this.tables[i].tableId,
                tableName: 'table#' + this.tables[i].tableId,
				players: this.tables[i].players.getNumberOfPlayers(Status.EMPTY, false),
				joinAllowed: this.tables[i].players.getNumberOfPlayers(Status.EMPTY, true) > 0
			});
		}

		return tableArray;
	};

	this.sendHomePageUpdateToIndividualSocket = function(socket) {
		var msg = this.createHomePageUpdateMessage();
	    socket.emit("home-page-update-message", msg);
	};

	this.sendHomePageUpdates = function() {
		const usernames = Object.keys(this.users);
		for (let i = 0; i < usernames.length; i++ ) {
			var socket = this.users[usernames[i]].socket;
			this.sendHomePageUpdateToIndividualSocket(socket);
		}
	};

	this.joinTable = function(username, tableId) {
		// Get table and ensure that it exists
	    var table = this.getTable(tableId);
	    if (table === null || table === undefined) {
	    	this.log.logSystem("User " + username + " attempted to join nonexistent Table #" + tableId);
	    	return false;
		}

	    if (username in this.users) {
			var oldLocation = this.users[username].location;
			var table2 = this.getTable(oldLocation);
			if (table2 !== null && table2 !== undefined) {
				table2.players.removeUser(username);
			}
			this.log.logSystem("User " + username + " removed from old location ( " + oldLocation + " ) and added to new location ( " + tableId + " )");
			table.players.waitingUsers.push(username);
			this.users[username].location = tableId;
			this.log.logSystem("User " + username + "  added to table ( " + tableId + " )");
		} else {
			this.log.logSystemError("Unexpected internal condition: user " + username + " did not previously exist in this.users during join-table operation");
		}

		return true;
	};

	this.sendMessageToTable = function(msg) {
		var tableId = this.users[msg.username].location;
		var table = this.getTable(tableId);
		table.addMessage(msg);
	};

	this.io.on('connection', function(socket) {
		// add user to userSockets
        const log = new Log();
        log.logSystem("User Connected");

        this.sendHomePageUpdateToIndividualSocket(socket);
		socket.emit('get-user-info', {});

		socket.on('user-info', function(msg) {
			log.logSystem('User Info Message received from user: ' + msg.username);
			var validated = this.validateMessage(msg);
			if (validated) {
				if (msg.username in this.users) {
					this.users[msg.username].socket = socket;
					log.logSystem("User " + msg.username + " was already in the system and reassigned a new socket");
					if (msg.location === this.homePage) {
					    var oldLocation = this.users[msg.username].location;
					    var table = this.getTable(oldLocation);
					    table.players.removeUser(msg.username);
						this.users[msg.username].location = this.homePage;
						log.logSystem("User " + msg.username + " was removed from any active games and returned to the homepage");
					}
				} else {
					this.users[msg.username] = {
						username: msg.username,
						socket: socket,
						location: msg.location
					};
					log.logSystem("User " + msg.username + " has connected for the first time to the system");
				}
			}

		}.bind(this));

		socket.on('create-table', function(msg) {
			log.logSystem('Create Table message sent from user ' + msg.username);
			var validated = this.validateMessage(msg);
			if (validated) {
				var val = this.createTable();
				if (val.result === true) {
					log.logSystem('Alerting user ' + msg.username + " of successful table creation");
					socket.emit("create-table-success", {});
					this.sendHomePageUpdates();
				} else {
					log.logSystem('Alerting user ' + msg.username + " of failed table creation");
					socket.emit("create-table-failure", {});
				}
			}
		}.bind(this));

		socket.on('join-table', function(msg) {
			log.logSystem('Join Table message received from ' + msg.username);
			var validated = this.validateMessage(msg);
			if (validated) {
				var result = this.joinTable(msg.username, parseInt(msg.tableId));
				if (result) {
					log.logSystem("Alerting user " + msg.username + " of success at joining table #" + msg.tableId);
					socket.emit("join-table-success", {url: this.tableUrl});
				} else {
					log.logSystem("Alerting user " + msg.username + " of failure at joining table #" + msg.tableId);
					socket.emit("join-table-failure");
				}
			}
		}.bind(this));

		socket.on('user-action-message', function(msg) {
			log.logSystem('User Action message received from ' + msg.username);
			var validated = this.validateMessage(msg);
			if (validated) {
				this.sendMessageToTable(msg);
			}
		}.bind(this));

		socket.on('disconnect', function() {

		});

	}.bind(this));

	this.mainLoop = function(gameServer) {
		if (!gameServer.mainLoopRunning) {
			gameServer.mainLoopRunning = true;
			for (var i = 0; i < gameServer.tables.length; i++) {
				gameServer.tables[i].next();
			}
			gameServer.mainLoopRunning = false;
		} else {
		}
	};
}

module.exports = {
	GameServer : GameServer
};
