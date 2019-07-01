// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import assert from 'assert';
import * as EmojiUtils from 'utils/emoji_utils';
import { SystemEmoji } from 'types/emojis';
describe('EmojiUtils', () => {
  describe('parseNeededCustomEmojisFromText', () => {
    it('no emojis', () => {
      const actual = EmojiUtils.parseNeededCustomEmojisFromText(
        'This has no emojis',
        new Map(),
        new Map(),
        new Set<string>()
      );
      const expected = new Set([]);
      assert.deepEqual(actual, expected);
    });
    it('some emojis', () => {
      const actual = EmojiUtils.parseNeededCustomEmojisFromText(
        ':this: :is_all: :emo-jis: :123:',
        new Map(),
        new Map(),
        new Set<string>()
      );
      const expected = new Set(['this', 'is_all', 'emo-jis', '123']);
      assert.deepEqual(actual, expected);
    });
    it('text surrounding emojis', () => {
      const actual = EmojiUtils.parseNeededCustomEmojisFromText(
        ':this:/:is_all: (:emo-jis:) surrounding:123:text:456:asdf',
        new Map(),
        new Map(),
        new Set<string>()
      );
      const expected = new Set(['this', 'is_all', 'emo-jis', '123', '456']);
      assert.deepEqual(actual, expected);
    });
    it('system emojis', () => {
      const actual = EmojiUtils.parseNeededCustomEmojisFromText(
        ':this: :is_all: :emo-jis: :123:',
        new Map<string, Partial<SystemEmoji>>([
          [
            'this',
            {
              name: 'this',
            },
          ],
          [
            '123',
            {
              name: '123',
            },
          ],
        ]),
        new Map(),
        new Set<string>()
      );
      const expected = new Set(['is_all', 'emo-jis']);
      assert.deepEqual(actual, expected);
    });
    it('custom emojis', () => {
      const actual = EmojiUtils.parseNeededCustomEmojisFromText(
        ':this: :is_all: :emo-jis: :123:',
        new Map(),
        new Map([
          [
            'is_all',
            {
              name: 'is_all',
            },
          ],
          [
            'emo-jis',
            {
              name: 'emo-jis',
            },
          ],
        ]),
        new Set<string>()
      );
      const expected = new Set(['this', '123']);
      assert.deepEqual(actual, expected);
    });
    it("emojis that we've already tried to load", () => {
      const actual = EmojiUtils.parseNeededCustomEmojisFromText(
        ':this: :is_all: :emo-jis: :123:',
        new Map(),
        new Map(),
        new Set(['this', 'emo-jis'])
      );
      const expected = new Set(['is_all', '123']);
      assert.deepEqual(actual, expected);
    });
  });
});
