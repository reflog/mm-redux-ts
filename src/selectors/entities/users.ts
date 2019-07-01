// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { createSelector } from 'reselect';
import {
  getCurrentChannelId,
  getCurrentUser,
  getCurrentUserId,
  getMyCurrentChannelMembership,
  getUsers,
} from 'selectors/entities/common';
import { getConfig, getLicense } from 'selectors/entities/general';
import {
  getDirectShowPreferences,
  getTeammateNameDisplaySetting,
} from 'selectors/entities/preferences';
import {
  displayUsername,
  filterProfilesMatchingTerm,
  sortByUsername,
  isSystemAdmin,
  profileListToMap,
} from 'utils/user_utils';
export { getCurrentUserId, getCurrentUser, getUsers };
import { GlobalState } from 'types/store.js';
import { UserProfile } from 'types/users.js';
import { Reaction } from 'types/reactions.js';
import { Team } from 'types/teams.js';
import { Channel } from 'types/channels.js';
import {
  RelationOneToOne,
  RelationOneToMany,
  IDMappedObjects,
  UsernameMappedObjects,
  EmailMappedObjects,
  $ID,
  $Username,
  $Email,
} from 'types/utilities.js';
type Filters = {
  role?: string;
  inactive?: boolean;
};
export function getUserIdsInChannels(
  state: GlobalState
): RelationOneToMany<Channel, UserProfile> {
  return state.entities.users.profilesInChannel;
}
export function getUserIdsNotInChannels(
  state: GlobalState
): RelationOneToMany<Channel, UserProfile> {
  return state.entities.users.profilesNotInChannel;
}
export function getUserIdsInTeams(
  state: GlobalState
): RelationOneToMany<Team, UserProfile> {
  return state.entities.users.profilesInTeam;
}
export function getUserIdsNotInTeams(
  state: GlobalState
): RelationOneToMany<Team, UserProfile> {
  return state.entities.users.profilesNotInTeam;
}
export function getUserIdsWithoutTeam(
  state: GlobalState
): Set<$ID<UserProfile>> {
  return state.entities.users.profilesWithoutTeam;
}
export function getUserStatuses(
  state: GlobalState
): RelationOneToOne<UserProfile, string> {
  return state.entities.users.statuses;
}
export function getUserSessions(state: GlobalState): Array<any> {
  return state.entities.users.mySessions;
}
export function getUserAudits(state: GlobalState): Array<any> {
  return state.entities.users.myAudits;
}
export function getUser(state: GlobalState, id: $ID<UserProfile>): UserProfile {
  return state.entities.users.profiles[id];
}
export const getUsersByUsername: (
  a: GlobalState
) => UsernameMappedObjects<UserProfile> = createSelector(
  getUsers,
  users => {
    const usersByUsername = {};

    for (const id in users) {
      if (users.hasOwnProperty(id)) {
        const user = users[id];
        usersByUsername[user.username] = user;
      }
    }

    return usersByUsername;
  }
);
export function getUserByUsername(
  state: GlobalState,
  username: $Username<UserProfile>
): UserProfile {
  return getUsersByUsername(state)[username];
}
export const getUsersByEmail: (
  a: GlobalState
) => EmailMappedObjects<UserProfile> = createSelector(
  getUsers,
  users => {
    const usersByEmail = {};

    for (const user of Object.keys(users).map(key => users[key])) {
      usersByEmail[user.email] = user;
    }

    return usersByEmail;
  }
);
export function getUserByEmail(
  state: GlobalState,
  email: $Email<UserProfile>
): UserProfile {
  return getUsersByEmail(state)[email];
}
export const isCurrentUserSystemAdmin: (
  a: GlobalState
) => boolean = createSelector(
  getCurrentUser,
  user => {
    const roles = user.roles || '';
    return isSystemAdmin(roles);
  }
);
export const getCurrentUserRoles: (
  a: GlobalState
) => UserProfile['roles'] = createSelector(
  getMyCurrentChannelMembership,
  state => state.entities.teams.myMembers[state.entities.teams.currentTeamId],
  getCurrentUser,
  (currentChannelMembership, currentTeamMembership, currentUser) => {
    let roles = '';

    if (currentTeamMembership) {
      roles += `${currentTeamMembership.roles} `;
    }

    if (currentChannelMembership) {
      roles += `${currentChannelMembership.roles} `;
    }

    if (currentUser) {
      roles += currentUser.roles;
    }

    return roles.trim();
  }
);
export const getCurrentUserMentionKeys: (
  a: GlobalState
) => Array<{
  key: string;
  caseSensitive?: boolean;
}> = createSelector(
  getCurrentUser,
  user => {
    let keys: { key: string; caseSensitive?: boolean }[] = [];

    if (!user || !user.notify_props) {
      return keys;
    }

    if (user.notify_props.mention_keys) {
      keys = keys.concat(
        user.notify_props.mention_keys.split(',').map(key => {
          return {
            key,
          };
        })
      );
    }

    if (user.notify_props.first_name === 'true' && user.first_name) {
      keys.push({
        key: user.first_name,
        caseSensitive: true,
      });
    }

    if (user.notify_props.channel === 'true') {
      keys.push({
        key: '@channel',
      });
      keys.push({
        key: '@all',
      });
      keys.push({
        key: '@here',
      });
    }

    const usernameKey = '@' + user.username;

    if (keys.findIndex(key => key.key === usernameKey) === -1) {
      keys.push({
        key: usernameKey,
      });
    }

    return keys;
  }
);
export const getProfileSetInCurrentChannel: (
  a: GlobalState
) => Array<$ID<UserProfile>> = createSelector(
  getCurrentChannelId,
  getUserIdsInChannels,
  (currentChannel, channelProfiles) => {
    return channelProfiles[currentChannel];
  }
);
export const getProfileSetNotInCurrentChannel: (
  a: GlobalState
) => Array<$ID<UserProfile>> = createSelector(
  getCurrentChannelId,
  getUserIdsNotInChannels,
  (currentChannel, channelProfiles) => {
    return channelProfiles[currentChannel];
  }
);
export const getProfileSetInCurrentTeam: (
  a: GlobalState
) => Array<$ID<UserProfile>> = createSelector(
  state => state.entities.teams.currentTeamId,
  getUserIdsInTeams,
  (currentTeam, teamProfiles) => {
    return teamProfiles[currentTeam];
  }
);
export const getProfileSetNotInCurrentTeam: (
  a: GlobalState
) => Array<$ID<UserProfile>> = createSelector(
  state => state.entities.teams.currentTeamId,
  getUserIdsNotInTeams,
  (currentTeam, teamProfiles) => {
    return teamProfiles[currentTeam];
  }
);
const PROFILE_SET_ALL = 'all';

function sortAndInjectProfiles(
  profiles: IDMappedObjects<UserProfile>,
  profileSet?: 'all' | Array<$ID<UserProfile>> | Set<$ID<UserProfile>>,
  skipInactive = false
): Array<UserProfile> {
  let currentProfiles: UserProfile[] = [];

  if (typeof profileSet === 'undefined') {
    return currentProfiles;
  } else if (profileSet === PROFILE_SET_ALL) {
    currentProfiles = Object.keys(profiles).map(key => profiles[key]);
  } else {
    currentProfiles = Array.from(profileSet).map(p => profiles[p]);
  }

  currentProfiles = currentProfiles.filter(profile => Boolean(profile));

  if (skipInactive) {
    currentProfiles = currentProfiles.filter(
      profile => !(profile.delete_at && profile.delete_at !== 0)
    );
  }

  return currentProfiles.sort(sortByUsername);
}

export const getProfiles: (
  a: GlobalState,
  b?: Filters
) => Array<UserProfile> = createSelector(
  getUsers,
  (state, filters) => filters,
  (profiles, filters) => {
    return sortAndInjectProfiles(
      filterProfiles(profiles, filters),
      PROFILE_SET_ALL
    );
  }
);

function filterProfiles(
  profiles: IDMappedObjects<UserProfile>,
  filters?: Filters
): IDMappedObjects<UserProfile> {
  if (!filters) {
    return profiles;
  }

  let users = Object.keys(profiles).map(key => profiles[key]);

  if (filters.role && filters.role !== '') {
    users = users.filter(
      user => user.roles && user.roles.includes((filters && filters.role) || '')
    );
  }

  if (filters.inactive) {
    users = users.filter(user => user.delete_at !== 0);
  }

  return users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
}

export const getProfilesInCurrentChannel: (
  a: GlobalState
) => Array<UserProfile> = createSelector(
  getUsers,
  getProfileSetInCurrentChannel,
  (profiles, currentChannelProfileSet) => {
    return sortAndInjectProfiles(profiles, currentChannelProfileSet);
  }
);
export const getProfilesNotInCurrentChannel: (
  a: GlobalState
) => Array<UserProfile> = createSelector(
  getUsers,
  getProfileSetNotInCurrentChannel,
  (profiles, notInCurrentChannelProfileSet) => {
    return sortAndInjectProfiles(profiles, notInCurrentChannelProfileSet);
  }
);
export const getProfilesInCurrentTeam: (
  a: GlobalState
) => Array<UserProfile> = createSelector(
  getUsers,
  getProfileSetInCurrentTeam,
  (profiles, currentTeamProfileSet) => {
    return sortAndInjectProfiles(profiles, currentTeamProfileSet);
  }
);
export const getProfilesInTeam: (
  a: GlobalState,
  b: $ID<Team>,
  c?
) => Array<UserProfile> = createSelector(
  getUsers,
  getUserIdsInTeams,
  (state, teamId) => teamId,
  (state, teamId, filters) => filters,
  (profiles, usersInTeams, teamId, filters) => {
    return sortAndInjectProfiles(
      filterProfiles(profiles, filters),
      usersInTeams[teamId] || new Set()
    );
  }
);
export const getProfilesNotInCurrentTeam: (
  a: GlobalState
) => Array<UserProfile> = createSelector(
  getUsers,
  getProfileSetNotInCurrentTeam,
  (profiles, notInCurrentTeamProfileSet) => {
    return sortAndInjectProfiles(profiles, notInCurrentTeamProfileSet);
  }
);
export const getProfilesWithoutTeam: (
  a: GlobalState,
  filters?: Filters
) => Array<UserProfile> = createSelector(
  getUsers,
  getUserIdsWithoutTeam,
  (state, filters) => filters,
  (profiles, withoutTeamProfileSet, filters) => {
    return sortAndInjectProfiles(
      filterProfiles(profiles, filters),
      withoutTeamProfileSet
    );
  }
);
export function getStatusForUserId(
  state: GlobalState,
  userId: $ID<UserProfile>
): string {
  return getUserStatuses(state)[userId];
}
export function getTotalUsersStats(state: GlobalState): any {
  return state.entities.users.stats;
}
export function searchProfiles(
  state: GlobalState,
  term: string,
  skipCurrent: boolean = false,
  filters?: Filters
): Array<UserProfile> {
  const users = getUsers(state);
  const profiles = filterProfilesMatchingTerm(
    Object.keys(users).map(key => users[key]),
    term
  );
  const filteredProfilesMap = filterProfiles(
    profileListToMap(profiles),
    filters
  );
  const filteredProfiles = Object.keys(filteredProfilesMap).map(
    key => filteredProfilesMap[key]
  );

  if (skipCurrent) {
    removeCurrentUserFromList(filteredProfiles, getCurrentUserId(state));
  }

  return filteredProfiles;
}
export function searchProfilesInCurrentChannel(
  state: GlobalState,
  term: string,
  skipCurrent: boolean = false
): Array<Partial<UserProfile>> {
  const profiles = filterProfilesMatchingTerm(
    getProfilesInCurrentChannel(state),
    term
  );

  if (skipCurrent) {
    removeCurrentUserFromList(profiles, getCurrentUserId(state));
  }

  return profiles;
}
export function searchProfilesNotInCurrentChannel(
  state: GlobalState,
  term: string,
  skipCurrent: boolean = false
): Array<Partial<UserProfile>> {
  const profiles = filterProfilesMatchingTerm(
    getProfilesNotInCurrentChannel(state),
    term
  );

  if (skipCurrent) {
    removeCurrentUserFromList(profiles, getCurrentUserId(state));
  }

  return profiles;
}
export function searchProfilesInCurrentTeam(
  state: GlobalState,
  term: string,
  skipCurrent: boolean = false
): Array<Partial<UserProfile>> {
  const profiles = filterProfilesMatchingTerm(
    getProfilesInCurrentTeam(state),
    term
  );

  if (skipCurrent) {
    removeCurrentUserFromList(profiles, getCurrentUserId(state));
  }

  return profiles;
}
export function searchProfilesInTeam(
  state: GlobalState,
  teamId: $ID<Team>,
  term: string,
  skipCurrent: boolean = false,
  filters?: Filters
): Array<UserProfile> {
  const profiles = filterProfilesMatchingTerm(
    getProfilesInTeam(state, teamId),
    term
  );
  const filteredProfilesMap = filterProfiles(
    profileListToMap(profiles),
    filters
  );
  const filteredProfiles = Object.keys(filteredProfilesMap).map(
    key => filteredProfilesMap[key]
  );

  if (skipCurrent) {
    removeCurrentUserFromList(filteredProfiles, getCurrentUserId(state));
  }

  return filteredProfiles;
}
export function searchProfilesNotInCurrentTeam(
  state: GlobalState,
  term: string,
  skipCurrent: boolean = false
): Array<Partial<UserProfile>> {
  const profiles = filterProfilesMatchingTerm(
    getProfilesNotInCurrentTeam(state),
    term
  );

  if (skipCurrent) {
    removeCurrentUserFromList(profiles, getCurrentUserId(state));
  }

  return profiles;
}
export function searchProfilesWithoutTeam(
  state: GlobalState,
  term: string,
  skipCurrent: boolean = false,
  filters?: Filters
): Array<Partial<UserProfile>> {
  const filteredProfiles = filterProfilesMatchingTerm(
    getProfilesWithoutTeam(state, filters),
    term
  );

  if (skipCurrent) {
    removeCurrentUserFromList(filteredProfiles, getCurrentUserId(state));
  }

  return filteredProfiles;
}

function removeCurrentUserFromList(
  profiles: Array<Partial<UserProfile>>,
  currentUserId: $ID<UserProfile>
) {
  const index = profiles.findIndex(p => p.id === currentUserId);

  if (index >= 0) {
    profiles.splice(index, 1);
  }
}

export const shouldShowTermsOfService: (
  a: GlobalState
) => boolean = createSelector(
  getConfig,
  getCurrentUser,
  getLicense,
  (config, user, license) => {
    // Defaults to false if the user is not logged in or the setting doesn't exist
    const acceptedTermsId = user ? user.terms_of_service_id : '';
    const acceptedAt = user ? user.terms_of_service_create_at : 0;
    const featureEnabled =
      license.IsLicensed === 'true' &&
      config.EnableCustomTermsOfService === 'true';
    const reacceptanceTime =
      config.CustomTermsOfServiceReAcceptancePeriod * 1000 * 60 * 60 * 24;
    const timeElapsed = new Date().getTime() - acceptedAt;
    return Boolean(
      user &&
        featureEnabled &&
        (config.CustomTermsOfServiceId !== acceptedTermsId ||
          timeElapsed > reacceptanceTime)
    );
  }
);
export const getUsersInVisibleDMs: (
  a: GlobalState
) => Array<UserProfile> = createSelector(
  getUsers,
  getDirectShowPreferences,
  (users, preferences) => {
    const dmUsers: UserProfile[] = [];
    preferences.forEach(pref => {
      if (pref.value === 'true' && users[pref.name]) {
        dmUsers.push(users[pref.name]);
      }
    });
    return dmUsers;
  }
);
export function makeGetProfilesForReactions(): (
  a: GlobalState,
  b: Array<Reaction>
) => Array<UserProfile> {
  return createSelector(
    getUsers,
    (state, reactions) => reactions,
    (users, reactions) => {
      const profiles: UserProfile[] = [];
      reactions.forEach(r => {
        if (users[r.user_id]) {
          profiles.push(users[r.user_id]);
        }
      });
      return profiles;
    }
  );
}
export function makeGetProfilesInChannel(): (
  a: GlobalState,
  b: $ID<Channel>,
  c?: boolean
) => Array<UserProfile> {
  return createSelector(
    getUsers,
    getUserIdsInChannels,
    (state, channelId) => channelId,
    (state, channelId, skipInactive) => skipInactive,
    (users, userIds, channelId, skipInactive = false) => {
      const userIdsInChannel = userIds[channelId];

      if (!userIdsInChannel) {
        return [];
      }

      return sortAndInjectProfiles(users, userIdsInChannel, skipInactive);
    }
  );
}
export function makeGetProfilesNotInChannel(): (
  a: GlobalState,
  b: $ID<Channel>,
  c?: boolean
) => Array<UserProfile> {
  return createSelector(
    getUsers,
    getUserIdsNotInChannels,
    (state, channelId) => channelId,
    (state, channelId, skipInactive) => skipInactive,
    (users, userIds, channelId, skipInactive = false) => {
      const userIdsInChannel = userIds[channelId];

      if (!userIdsInChannel) {
        return [];
      }

      return sortAndInjectProfiles(users, userIdsInChannel, skipInactive);
    }
  );
}
export function makeGetProfilesByIdsAndUsernames(): (
  a: GlobalState,
  b: {
    allUserIds: Array<$ID<UserProfile>>;
    allUsernames: Array<$Username<UserProfile>>;
  }
) => Array<UserProfile> {
  return createSelector(
    getUsers,
    getUsersByUsername,
    (state, props) => props.allUserIds,
    (state, props) => props.allUsernames,
    (allProfilesById, allProfilesByUsername, allUserIds, allUsernames) => {
      const userProfiles: UserProfile[] = [];

      if (allUserIds && allUserIds.length > 0) {
        const profilesById = allUserIds
          .filter(userId => allProfilesById[userId])
          .map(userId => allProfilesById[userId]);

        if (profilesById && profilesById.length > 0) {
          userProfiles.push(...profilesById);
        }
      }

      if (allUsernames && allUsernames.length > 0) {
        const profilesByUsername = allUsernames
          .filter(username => allProfilesByUsername[username])
          .map(username => allProfilesByUsername[username]);

        if (profilesByUsername && profilesByUsername.length > 0) {
          userProfiles.push(...profilesByUsername);
        }
      }

      return userProfiles;
    }
  );
}
export function makeGetDisplayName(): (
  a: GlobalState,
  b: $ID<UserProfile>,
  c?: boolean
) => string {
  return createSelector(
    (state, userId) => getUser(state, userId),
    getTeammateNameDisplaySetting,
    (state, _, useFallbackUsername = true) => useFallbackUsername,
    (user, teammateNameDisplaySetting, useFallbackUsername) => {
      return displayUsername(
        user,
        teammateNameDisplaySetting,
        useFallbackUsername
      );
    }
  );
}
