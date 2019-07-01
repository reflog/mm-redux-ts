// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable global-require, no-process-env */
let conf;
if (process.env.NODE_ENV === 'production') {
  conf = require('./configureStore.prod').default;
} else {
  conf = require('./configureStore.dev').default;
}
export default conf;
/* eslint-enable global-require, no-process-env */
