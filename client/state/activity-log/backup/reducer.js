/** @format */
/**
 * Internal dependencies
 */
import { REWIND_BACKUP, REWIND_BACKUP_DISMISS, REWIND_BACKUP_PLEASE } from 'state/action-types';
import { keyedReducer } from 'state/utils';

export const backupRequest = keyedReducer(
	'siteId',
	( state = undefined, { type, activityId } ) => {
		switch ( type ) {
			case REWIND_BACKUP:
			case REWIND_BACKUP_DISMISS:
				return undefined;

			case REWIND_BACKUP_PLEASE:
				return activityId;

			default:
				return state;
		}
	}
);
