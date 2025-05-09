import { type ITarget, serviceCall } from '@hass-blocks/core';

/**
 * @public
 *
 * Change the volume level of a specific media player
 *
 * @param target - The entity or area id of the media player you want to target
 * @param volume - The volume level (between 0 and 1)
 * @returns
 */
export const setMediaPlayerVolume = (target: ITarget, volume: number) =>
  serviceCall({
    name: `Set media player volume to ${volume}`,
    params: {
      domain: 'media_player',
      service: 'volume_set',
      service_data: {
        volume_level: volume,
      },
    },
    target,
  });
