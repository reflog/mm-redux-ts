// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable no-console */

(global as any).WebSocket = require('ws');

import 'isomorphic-fetch';
let warns;
let errors;
beforeAll(() => {
  (console as any).originalWarn = console.warn;
  console.warn = jest.fn((...params) => {
    (console as any).originalWarn(...params);
    warns.push(params);
  });

  (console as any).originalError = console.error;
  console.error = jest.fn((...params) => {
    (console as any).originalError(...params);
    errors.push(params);
  });
});

beforeEach(() => {
  warns = [];
  errors = [];
});

afterEach(() => {
  if (warns.length > 0 || errors.length > 0) {
    throw new Error('Unexpected console logs' + warns + errors);
  }
});
