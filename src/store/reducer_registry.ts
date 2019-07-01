// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
// Based on http://nicolasgallagher.com/redux-modules-and-code-splitting/
import * as Redux from 'redux';
export class ReducerRegistry {
  emitChange?: Function;
  reducers: { [k: string]: Redux.Reducer[] };
  constructor() {
    this.reducers = {};
  }

  setReducers = reducers => {
    this.reducers = reducers;
  };
  getReducers = () => {
    return { ...this.reducers };
  };
  register = (name, reducer) => {
    this.reducers = { ...this.reducers, [name]: reducer };

    if (this.emitChange) {
      this.emitChange(this.getReducers());
    }
  };
  setChangeListener = listener => {
    this.emitChange = listener;
  };
}
const reducerRegistry = new ReducerRegistry();
export default reducerRegistry;
