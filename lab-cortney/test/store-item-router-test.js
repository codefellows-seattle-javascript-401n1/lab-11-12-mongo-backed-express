'use strict';

process.env.MONGO_URI = 'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent');
const superPromise = require('superagent-promise-plugin');

const storeItemCrud = require('../lib/store-item-crud');

const server = require('../server');
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
