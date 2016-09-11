#!/usr/bin/env node
'use strict';
var program = require('commander');
var inquirer = require('inquirer');
var mockptop = require('./mockdht.js');
/**
 * @example kad/basiclocal
 */
var kad = require('kad');
var traverse = require('kad-traverse');
var KadLocalStorage = require('kad-localstorage');
var getIP = require('external-ip')();

var ip = '';
getIP(function (err, ip) {
    if (err) {
        // every service in the list has failed
        throw err;
    }

console.log('extippp' + ip);

var dht;

program
    .version('0.0.1')
    .usage('[options] <Sampling>')
    .description('Decentralized Sampling Protocol')
    .option('-a, --address [addr]', 'Node identity')
    .option('-p, --port [port]', 'Port to connect')
    .parse(process.argv);

if(!program.args.length) {
  program.help();
}
else
{

console.log('Sampling: ' + program.args);
console.log('Address: ' + program.address);
console.log('Port: ' + program.port);
//console.log(program);
    var questions = [
      {
        type: 'input',
        name: 'incommand',
        message: '>>>'
      }
    ];

    ask();
}

function ask() {
  inquirer.prompt(questions).then(function (answers) {
    if(answers.incommand == 'exit')
    {
      console.log('original exit');
      // need to exit the DHT
      process.exit(1);
    }
    else if(answers.incommand == 'dht') {
      // make commandline accessable again
console.log('start DHT');
      //mockdht();
      startdht(program.address, program.port);

    }
    else if(answers.incommand == 'seed') {
      // make commandline accessable again
console.log('start Seed process');
console.log(answers);
      seedask();

    }
    else if(answers.incommand == 'dmap') {
      // make ethereum smart contract
      console.log('smart contract Dmaps started');
      mockdht();
      ask();

    }
    else if(answers.incommand == 'calldmap') {
      // make ethereum smart contract
      console.log('smart contract Dmaps called');
      mockcallDmap();
      ask();

    }
    else if(answers.incommand == 'read') {
      // read existing messages
      console.log('read message called');
      readmessage();
      ask();

    }
    else if(answers.incommand == 'ethereum') {
      // bring ethereum to life
      console.log('bringing ethereum to life');
      var spawn = require('child_process').spawn;

      var cmd = spawn('geth', ['--networkid 12345', '--datadir ~/.ethereum_experiment', '--rpc', '--rpccorsdomain "*"', '--unlock=6f511fe12ba50e2f2d9de99a4d2bfc61332aebb0', 'console'
], {stdio: 'pipe'});
      cmd.stdout.pipe(ui.log);
      cmd.on('close', function () {
      //  ui.updateBottomBar('Installation done!\n');
      //  process.exit();
      });
      ask();

    }
    else {
      console.log('Stopped:', output.join(', '));
      process.exit(1);
    }
  });
};


// LOGIC FUNCTIONS

//start mock ptop network
function mockdht() {

  var livemock = new mockptop();
  livemock.publiclogs();
};

//start mock ptop network
function mockcallDmap() {

  var livemock = new mockptop();
  livemock.callDmap();
};

function startdht (addressIn, portIn) {
console.log(addressIn);
console.log(portIn);
  var portnumber = parseInt(portIn);
  var key;
  var callback;
  // Decorate your transport
console.log('exterip pickedup == ' + ip + 'and port== ' + portnumber);
// Create your contact
var contact = kad.contacts.AddressPortContact({
  address: ip,
  port: portnumber
});
// Decorate your transport
var NatTransport = traverse.TransportDecorator(kad.transports.UDP);

// Create your transport with options
var transportlive = new NatTransport(contact, {
  traverse: {
    upnp: { forward: 1901,
                ttl: 0 },
    stun: { address: 'stun.services.mozilla.com',
                 port: 3478 },
    turn: { address: 'turn.counterpointhackers.org',
                 port: 3478 }
  }
});

  dht = new kad.Node({
    transport: transportlive,
    storage: kad.storage.FS('datadir'),
    validator: 'somethingtocheck'
    //storage: new KadLocalStorage('label')
  });

  ask();

}

function seedask() {

  var questionseed = [
    {
      type: 'input',
      name: 'addressseed',
      message: 'Enter the IP address to send too:'
    },
    {
      type: 'input',
      name: 'portseed',
      message: 'Port number of the seed:'
    },
    {
      type: 'input',
      name: 'message',
      message: 'Message to send:'
    }

  ];
  inquirer.prompt(questionseed).then(function (answerseed) {

    var output = [];
    output.push(answerseed.addressseed);
    output.push(answerseed.portseed);
    output.push(answerseed.message);
console.log('output muilt inquery cli');
console.log(output);
    if(answerseed.portseed)
    {
      //  now make the seed call to DHT
      seeddht(output);

    }
  });

};

function seeddht(seedIn) {
console.log('seed dht info');
console.log(seedIn);
console.log('seedsht function');
    var sportnumber = parseInt(seedIn[1]);
    var seed = {
      address: seedIn[0],
      port: sportnumber
    };

  dht.connect(seed, function(err) {
    var key = '08764';
    var value = seedIn[2];
    var info = '';
    dht.put(key, value, function() {
      dht.get(key, function(err, info) {
console.log('SEED successfully put and get an item in the dht');
console.log(info);
      });
    });
  });
  // call the original ask function
  console.log('original ask');
  ask();

};

function readmessage () {
      var key = '0222';
      dht.get(key, function(err, info) {
console.log('successfully read message');
console.log(info);
      });

};

});
