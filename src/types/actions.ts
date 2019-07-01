// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { GlobalState } from './store';
import * as Redux from 'redux';
export type GetStateFunc = () => GlobalState;
export interface GenericAction extends Redux.AnyAction {
  type: string;
  data?: any;
  meta?: any;
  error?: any;
  index?: number;
  displayable?: boolean;
  postId?: string;
  sessionId?: string;
  currentUserId?: string;
  remove?: Function | string[];
}
type Thunk = (a: Redux.Dispatch<any>, b: GetStateFunc) => Promise<ActionResult>; // eslint-disable-line no-use-before-define

interface BatchAction extends Redux.Action {
  type: 'BATCHING_REDUCER.BATCH';
  payload: Array<GenericAction>;
}
export type Action = GenericAction | Thunk | BatchAction | ActionFunc;
export type ActionResult =
  | {
      data: any;
    }
  | {
      error: any;
    };
export type DispatchFunc = (
  a: Action,
  b?: GetStateFunc
) => Promise<ActionResult>;
export type ActionFunc = (
  a: DispatchFunc,
  b: GetStateFunc
) => Promise<ActionResult>;

export const BATCH = 'BATCHING_REDUCER.BATCH';

export function batchActions(actions: Action[], type = BATCH) {
  return { type, meta: { batch: true }, payload: actions };
}

export function enableBatching(reduce) {
  return function batchingReducer(state, action) {
    if (action && action.meta && action.meta.batch) {
      return action.payload.reduce(batchingReducer, state);
    }
    return reduce(state, action);
  };
}

export function batchDispatchMiddleware(store) {
  function dispatchChildActions(store, action) {
    if (action.meta && action.meta.batch) {
      action.payload.forEach(function(childAction) {
        dispatchChildActions(store, childAction);
      });
    } else {
      store.dispatch(action);
    }
  }

  return function(next) {
    return function(action) {
      if (action && action.meta && action.meta.batch) {
        dispatchChildActions(store, action);
      }
      return next(action);
    };
  };
}
