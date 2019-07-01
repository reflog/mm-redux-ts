// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
// I assume these are the loglevels
export type logLevel = 'ERROR' | 'WARNING' | 'INFO';
export type GenericClientResponse = {
  response: any;
  status?: any;
  headers: Map<string, string>;
  data: any;
};

type ErrorApi = {
  message: string;
  server_error_id: string;
  status_code: number;
  url: string;
};
export type Client4Error = ErrorApi;
