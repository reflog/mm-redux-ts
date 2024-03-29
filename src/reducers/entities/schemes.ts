// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { combineReducers } from 'redux';
import { SchemeTypes, UserTypes } from 'action_types';
import { GenericAction } from 'types/actions';
import { SchemesState, Scheme } from 'types/schemes';

function schemes(
  state: {
    [x: string]: Scheme;
  } = {},
  action: GenericAction
): {
  [x: string]: Scheme;
} {
  switch (action.type) {
    case SchemeTypes.CREATED_SCHEME:
    case SchemeTypes.PATCHED_SCHEME:
    case SchemeTypes.RECEIVED_SCHEME: {
      return { ...state, [action.data.id]: action.data };
    }

    case SchemeTypes.RECEIVED_SCHEMES: {
      const nextState = { ...state };

      for (const scheme of action.data) {
        nextState[scheme.id] = scheme;
      }

      return nextState;
    }

    case SchemeTypes.DELETED_SCHEME: {
      const nextState = { ...state };
      Reflect.deleteProperty(nextState, action.data.schemeId);
      return nextState;
    }

    case UserTypes.LOGOUT_SUCCESS:
      return {};

    default:
      return state;
  }
}

const _moduleExport: (
  a: SchemesState,
  b: GenericAction
) => SchemesState = combineReducers({
  schemes,
});

export default _moduleExport;
