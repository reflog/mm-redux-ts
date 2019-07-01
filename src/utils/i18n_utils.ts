// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
let localizeFunction: Function | null | undefined = null;
export function setLocalizeFunction(func: Function | null | undefined) {
  localizeFunction = func;
}
export function localizeMessage(id: string, defaultMessage: string): string {
  if (!localizeFunction) {
    return defaultMessage;
  }

  return localizeFunction(id, defaultMessage);
}
