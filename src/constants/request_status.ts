// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { RequestStatusOption } from 'types/requests';

type StatusMap = { [k: string]: RequestStatusOption };
const statuses: StatusMap = {
  NOT_STARTED: 'not_started',
  STARTED: 'started',
  SUCCESS: 'success',
  FAILURE: 'failure',
  CANCELLED: 'cancelled',
};
export default statuses;
