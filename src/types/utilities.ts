// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
export type $ID<E> = E['id'];
export type $UserID<E> = E['user_id'];
export type $Name<E> = E['name'];
export type $Username<E> = E['username'];
export type $Email<E> = E['email'];
export type RelationOneToOne<E, T> = {
  [x in $ID<E>]: T;
};
export type RelationOneToMany<E1, E2> = {
  [x in $ID<E1>]: Array<$ID<E2>>;
};
export type IDMappedObjects<E> = RelationOneToOne<E, E>;
export type UserIDMappedObjects<E> = {
  [x in $UserID<E>]: E;
};
export type NameMappedObjects<E> = {
  [x in $Name<E>]: E;
};
export type UsernameMappedObjects<E> = {
  [x in $Username<E>]: E;
};
export type EmailMappedObjects<E> = {
  [x in $Email<E>]: E;
};
