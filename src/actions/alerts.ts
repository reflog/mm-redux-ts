// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { AlertTypes } from 'action_types';
import { Alerts } from '../constants';
import { ActionFunc } from 'types/actions';
import { AlertType, AlertTypeType } from 'types/alerts';
export function pushNotificationAlert(message: string): ActionFunc {
  return async (dispatch, getState) => {
    const notificationAlert: AlertType = {
      type: Alerts.ALERT_NOTIFICATION as AlertTypeType,
      message,
    };
    dispatch(
      {
        type: AlertTypes.PUSH_ALERT,
        data: notificationAlert,
      },
      getState
    );
    return {
      data: true,
    };
  };
}
export function pushDeveloperAlert(message: string): ActionFunc {
  return async (dispatch, getState) => {
    const developerAlert: AlertType = {
      type: Alerts.ALERT_DEVELOPER as AlertTypeType,
      message,
    };
    dispatch(
      {
        type: AlertTypes.PUSH_ALERT,
        data: developerAlert,
      },
      getState
    );
    return {
      data: true,
    };
  };
}
export function pushErrorAlert(message: string): ActionFunc {
  return async (dispatch, getState) => {
    const errorAlert: AlertType = {
      type: Alerts.ALERT_ERROR as AlertTypeType,
      message,
    };
    dispatch(
      {
        type: AlertTypes.PUSH_ALERT,
        data: errorAlert,
      },
      getState
    );
    return {
      data: true,
    };
  };
}
export function clearLatestAlert(): ActionFunc {
  return async (dispatch, getState) => {
    dispatch(
      {
        type: AlertTypes.CLEAR_ALERT,
        data: null,
      },
      getState
    );
    return {
      data: true,
    };
  };
}
