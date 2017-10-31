/**
 * Internal dependencies
 *
 * @format
 */

import { combineReducers } from 'state/utils';
import { activationRequesting } from './activation/reducer';
import { logItems } from './log/reducer';
import { restoreProgress, restoreRequest } from './restore/reducer';
import { rewindStatus, rewindStatusError } from './rewind-status/reducer';
import { backupRequest } from './backup/reducer';

export default combineReducers( {
	activationRequesting,
	logItems,
	restoreProgress,
	restoreRequest,
	backupRequest,
	rewindStatus,
	rewindStatusError,
} );
