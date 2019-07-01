// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { SyncableType } from 'types/groups';

const groups: { [key: string]: SyncableType } = {
  SYNCABLE_TYPE_TEAM: 'team',
  SYNCABLE_TYPE_CHANNEL: 'channel',
};
export default groups;
