var https = require('https');
const fs = require ('fs');

const Log = require("./log").Log;
const Table = require('./table').Table;
const Status = require('./definition').Status;

function GameServer (server) {
	this.log = new Log();
	this.tables = [];
	this.server = server;
	this.tableCounter = 1;
	this.mainLoopRunning = false;
	this.server = server;
	this.io = require('socket.io')(server);

	/**
	 * Creates a new Table with a new Table ID and a new
	 */
	this.createTable = function () {
		if (this.tables.length < 10) {
			var newTable = new Table(this.tableCounter);
			this.tables.push(newTable);
			this.log.logSystem("Table created, with ID: " + this.tableCounter);
			this.tableCounter++;
		}
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

	this.start = function() {
		setInterval(this.mainLoop, 500, this);
	};

	this.io.on('connection', function(socket) {
		// add user to userSockets
        const log = new Log();
        log.logSystem("User Connected");
		socket.emit('get-user-info', {});

		socket.on('user-info', function(msg) {
			log.logSystem('User info message sent');
			console.log(msg.username + ":" + msg.token);
			/*
			var validated = db_placeholder.validateUser(msg.username, msg.jwt);
			if (validated) {
				userSockets[username] = socket;
			}
			 */

		});

		socket.on('create-table', function(msg) {
			log.logSystem('Create Table message sent');
		    /*
			var validated = db_placeholder.validateUser(msg.username, msg.jwt);
			if (validated) {
				var table = createTable();
				socket.emit("join-table"); // TODO - implement on client side
			}
		     */
		});

		socket.on('join-table', function(msg) {
			log.logSystem('Join Table message sent');
		    /*
			var validated = db_placeholder.validateUser(msg.username, msg.jwt);
			if (validated) {

			}
		     */
		});

		socket.on('user-action-message', function(msg) {
			log.logSystem('User Action message sent');
		    /*
			var validated = db_placeholder.validateUser(msg.username, msg.jwt);
			if (validated) {

			}
		     */

		});

		socket.on('disconnect', function() {

		});

	});

	this.mainLoop = function(gameServer) {
		if (!gameServer.mainLoopRunning) {
			gameServer.mainLoopRunning = true;
			for (var i = 0; i < gameServer.tables.length; i++) {
				tables[i].next();
			}
			gameServer.mainLoopRunning = false;
		} else {
		}
	}
}

module.exports = {
	GameServer : GameServer
};
