// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { createSelector } from 'reselect';
import { getCurrentTeamId } from 'selectors/entities/teams';
import { IDMappedObjects } from 'types/utilities';
import { Command, OutgoingWebhook } from 'types/integrations';
export function getIncomingHooks(state) {
  return state.entities.integrations.incomingHooks;
}
export function getOutgoingHooks(state): IDMappedObjects<OutgoingWebhook> {
  return state.entities.integrations.outgoingHooks;
}
export function getCommands(state): IDMappedObjects<Command> {
  return state.entities.integrations.commands;
}
export function getOAuthApps(state) {
  return state.entities.integrations.oauthApps;
}
export function getSystemCommands(state): IDMappedObjects<Command> {
  return state.entities.integrations.systemCommands;
}
/**
 * get outgoing hooks in current team
 */

export const getOutgoingHooksInCurrentTeam = createSelector(
  getCurrentTeamId,
  getOutgoingHooks,
  (teamId, hooks) => {
    return Object.values(hooks).filter(o => (o as any).teamId === teamId); // TODO why .teamId ?
  }
);
export const getAllCommands = createSelector(
  getCommands,
  getSystemCommands,
  (commands, systemCommands) => {
    return { ...commands, ...systemCommands };
  }
);
export const getAutocompleteCommandsList = createSelector(
  getAllCommands,
  getCurrentTeamId,
  (commands, currentTeamId) => {
    return Object.values(commands)
      .filter(command => {
        return (
          command &&
          (!command.team_id || command.team_id === currentTeamId) &&
          command.auto_complete
        );
      })
      .sort((a, b) => a.display_name.localeCompare(b.display_name));
  }
);
