'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const server = require('../server');
const playerCrud = require('../lib/player-crud');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
