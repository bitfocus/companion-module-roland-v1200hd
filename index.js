// Roland-V1200-HD

var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.CHOICES_INPUTS = [
	{ id: '0', label: 'SDI 1' },
	{ id: '1', label: 'SDI 2' },
	{ id: '2', label: 'SDI 3' },
	{ id: '3', label: 'SDI 4' },
	{ id: '4', label: 'SDI 5' },
	{ id: '5', label: 'SDI 6' },
	{ id: '6', label: 'SDI 7' },
	{ id: '7', label: 'SDI 8' },
	{ id: '8', label: 'SDI 9' },
	{ id: '9', label: 'SDI 10' },
	{ id: '10', label: 'HDMI 1' },
	{ id: '11', label: 'HDMI 2' },
	{ id: '12', label: 'HDMI 3' },
	{ id: '13', label: 'HDMI 4' },
	{ id: '14', label: 'STILL 1' },
	{ id: '15', label: 'STILL 2' },
	{ id: '16', label: 'EXP 1' },
	{ id: '17', label: 'EXP 2' },
	{ id: '18', label: 'RE-ENTRY' },
	{ id: '19', label: 'SIG GEN' },
	{ id: '20', label: 'NONE' }
]

instance.prototype.CHOICES_STILLMEMORY = [
	{ id: '0', label: 'Still Memory 1'},
	{ id: '1', label: 'Still Memory 2'},
	{ id: '2', label: 'Still Memory 3'},
	{ id: '3', label: 'Still Memory 4'},
	{ id: '4', label: 'Still Memory 5'},
	{ id: '5', label: 'Still Memory 6'},
	{ id: '6', label: 'Still Memory 7'},
	{ id: '7', label: 'Still Memory 8'},
	{ id: '8', label: 'Still Memory 9'},
	{ id: '9', label: 'Still Memory 10'},
	{ id: '10', label: 'Still Memory 11'},
	{ id: '11', label: 'Still Memory 12'},
	{ id: '12', label: 'Still Memory 13'},
	{ id: '13', label: 'Still Memory 14'},
	{ id: '14', label: 'Still Memory 15'},
	{ id: '15', label: 'Still Memory 16'}
]

instance.prototype.CHOICES_SWITCHING = [
	{ id: '0', label: 'Cut' },
	{ id: '1', label: 'Auto Mix' },
	{ id: '2', label: 'Auto Wipe' }
]

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_tcp();
}

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.init_tcp();
}

instance.prototype.init_tcp = function() {
	var self = this;
	var receivebuffer = '';

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.port === undefined) {
		self.config.port = 8023;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug('Network error', err);
			self.log('error','Network error: ' + err.message);
		});

		self.socket.on('connect', function () {
			debug('Connected');
		});

		// if we get any data, display it to stdout
		self.socket.on('data', function(buffer) {
			var indata = buffer.toString('utf8');
			//future feedback can be added here
		});

	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will connect to a Roland Pro AV V-1200HD Video Switcher.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 6,
			default: '192.168.0.1',
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port',
			width: 4,
			default: '8023',
			regex: self.REGEX_PORT,
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug('destroy', self.id);
}

instance.prototype.actions = function() {
	var self = this;

	self.setActions({

		'me_select_pgm': {
			label: 'ME PGM Output',
			options: [
				{
					type: 'dropdown',
					label: 'ME',
					id: 'me',
					default: '1',
					choices: [ {id: '1', label: 'ME 1'}, {id: '2', label: 'ME 2'}]
				},
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '0',
					choices: self.CHOICES_INPUTS
				}
			]
		},
		'me_select_pst': {
			label: 'ME PST Output',
			options: [
				{
					type: 'dropdown',
					label: 'ME',
					id: 'me',
					default: '1',
					choices: [ {id: '1', label: 'ME 1'}, {id: '2', label: 'ME 2'}]
				},
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '0',
					choices: self.CHOICES_INPUTS
				}
			]
		},
		'me_transition': {
			label: 'ME Transition',
			options: [
				{
					type: 'dropdown',
					label: 'ME',
					id: 'me',
					default: '1',
					choices: [ {id: '1', label: 'ME 1'}, {id: '2', label: 'ME 2'}]
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: '0',
					choices: self.CHOICES_SWITCHING
				}
			]
		},
		'still_select': {
			label: 'Still Memory Select',
			options: [
				{
					type: 'dropdown',
					label: 'Still Bank',
					id: 'still',
					default: '1',
					choices: [ {id: '1', label: 'STILL 1'}, {id: '2', label: 'STILL 2'}]
				},
				{
					type: 'dropdown',
					label: 'Memory',
					id: 'memory',
					default: '0',
					choices: self.CHOICES_STILLMEMORY
				}
			]
		},
		'composition_inputselect': {
			label: 'Composition Input Select',
			options: [
				{
					type: 'dropdown',
					label: 'Composition',
					id: 'composition',
					default: '1',
					choices: [ {id: '1', label: 'Composition 1'}, {id: '2', label: 'Composition 2'}, {id: '3', label: 'Composition 3'}, {id: '4', label: 'Composition 4'}]
				},
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '0',
					choices: self.CHOICES_INPUTS
				}
			]
		},
		'composition_outputtransition': {
			label: 'Composition Output Transition',
			options: [
				{
					type: 'dropdown',
					label: 'Composition',
					id: 'composition',
					default: '1',
					choices: [ {id: '1', label: 'Composition 1'}, {id: '2', label: 'Composition 2'}, {id: '3', label: 'Composition 3'}, {id: '4', label: 'Composition 4'}]
				},
				{
					type: 'dropdown',
					label: 'Transition',
					id: 'transition',
					default: '0',
					choices: self.CHOICES_SWITCHING
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'onoff',
					default: '0',
					choices: [ {id: '0', label: 'OFF'}, {id: '1', label: 'ON'}]
				}
			]
		},
		'aux_select': {
			label: 'Aux Input Select',
			options: [
				{
					type: 'dropdown',
					label: 'Aux',
					id: 'aux',
					default: '1',
					choices: [ {id: '1', label: 'Aux 1'}, {id: '2', label: 'Aux 2'}]
				},
				{
					type: 'dropdown',
					label: 'Input',
					id: 'input',
					default: '0',
					choices: self.CHOICES_INPUTS
				}
			]
		},
		'hdmi_output_select': {
			label: 'HDMI Output Selection',
			options: [
				{
					type: 'dropdown',
					label: 'HDMI',
					id: 'hdmi',
					default: '1',
					choices: [ {id: '1', label: 'HDMI 1'}, {id: '2', label: 'HDMI 2'}]
				},
				{
					type: 'dropdown',
					label: 'XPT',
					id: 'xpt',
					default: '0',
					choices: [ {id: '0', label: 'XPT 1'}, {id: '1', label: 'XPT 2'}, {id: '2', label: 'XPT 3'}, {id: '3', label: 'XPT 4'}]
				},
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: '0',
					choices: [ {id: '0', label: 'CUT'}, {id: '1', label: 'MIX'}]
				}
			]
		},
		'composition_source_select': {
			label: 'Composition Source Selection',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'source',
					default: '0',
					choices: [ {id: '0', label: 'S1'}, {id: '1', label: 'S2'}, {id: '2', label: 'HDMI 3'}, {id: '3', label: 'HDMI 4'}]
				}
			]
		},
		'composition_output': {
			label: 'Composition Output',
			options: [
				{
					type: 'dropdown',
					label: 'Type',
					id: 'type',
					default: '0',
					choices: [ {id: '0', label: 'CUT'}, {id: '1', label: 'MIX'}]
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'onoff',
					default: '0',
					choices: [ {id: '0', label: 'OFF'}, {id: '1', label: 'ON'}]
				}
			]
		},
		'hdmi_output_fadestart': {
			label: 'HDMI Output Fade Start',
			options: [
				{
					type: 'dropdown',
					label: 'HDMI',
					id: 'hdmi',
					default: '1',
					choices: [ {id: '1', label: 'HDMI 1'}, {id: '2', label: 'HDMI 2'}]
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'onoff',
					default: '0',
					choices: [ {id: '0', label: 'OFF'}, {id: '1', label: 'ON'}]
				}
			]
		},
		'output_fadestart': {
			label: 'Output Fade Start',
			options: [
				{
					type: 'dropdown',
					label: 'Bus',
					id: 'bus',
					default: '0',
					choices: [ {id: '0', label: 'Bus 1'}, {id: '1', label: 'Bus 2'}, {id: '2', label: 'Bus 3'}, {id: '3', label: 'Bus 4'}, {id: '4', label: 'Bus 5'}, {id: '5', label: 'Bus 6'}]
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'onoff',
					default: '0',
					choices: [ {id: '0', label: 'OFF'}, {id: '1', label: 'ON'}]
				}
			]
		},
		'memory_recall': {
			label: 'Memory Recall',
			options: [
				{
					type: 'dropdown',
					label: 'Memory',
					id: 'memory',
					default: '0',
					choices: [ {id: '0', label: 'Memory 1'}, {id: '1', label: 'Memory 2'}, {id: '2', label: 'Memory 3'}, {id: '3', label: 'Memory 4'}, {id: '4', label: 'Memory 5'}, {id: '5', label: 'Memory 6'}, {id: '6', label: 'Memory 7'}, {id: '7', label: 'Memory 8'}]
				}
			]
		}	
	});
}

instance.prototype.action = function(action) {

	var self = this;
	var cmd;
	var options = action.options;
	
	var stx = '\u0002';
	
	switch(action.action) {
		case 'me_select_pgm':
			cmd = stx + 'PM' + options.me + ':' + options.input + ';';
			break;
		case 'me_select_pst':
			cmd = stx + 'PT' + options.me + ':' + options.input + ';';
			break;
		case 'me_transition':
			cmd = stx + 'PP' + options.me + ':' + options.type + ';';
			break;
		case 'still_select':
			cmd = stx + 'ST' + options.still + ':' + options.memory + ';';
			break;
		case 'composition_inputselect':
			cmd = stx + 'CS' + options.composition + ':' + options.input + ';';
			break;
		case 'composition_outputtransition':
			cmd = stx + 'CP' + options.composition + ':' + options.transition + ',' + options.onoff + ';';
			break;
		case 'aux_select':
			cmd = stx + 'AX' + options.aux + ':' + options.input + ';';
			break;
		case 'hdmi_output_select':
			cmd = stx + '4X' + options.hdmi + ':' + options.xpt + ',' + options.type + ';';
			break;
		case 'composition_source_select':
			cmd = stx + '4CS:' + options.source + ';';
			break;
		case 'composition_output':
			cmd = stx + '4CP:' + options.type + ',' + options.onoff + ';';
			break;
		case 'hdmi_output_fadestart':
			cmd = stx + '4F' + options.hdmi + ':' + options.onoff + ';';
			break;
		case 'output_fadestart':
			cmd = stx + 'FDE:' + options.bus + ',' + options.onoff + ';';
			break;
		case 'memory_recall':
			cmd = stx + 'MEM:' + options.memory + ';';
			break;
	}

	if (cmd !== undefined) {
		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd);
		} else {
			debug('Socket not connected :(');
		}

	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
