/** @format */
/**
 * External dependencies
 */
import { get, includes, last } from 'lodash';

/**
 * Internal dependencies
 */
import createSelector from 'lib/create-selector';
import {
	HAPPYCHAT_GROUP_WPCOM,
	HAPPYCHAT_GROUP_JPOP,
	HAPPYCHAT_CHAT_STATUS_ABANDONED,
	HAPPYCHAT_CHAT_STATUS_BLOCKED,
	HAPPYCHAT_CHAT_STATUS_DEFAULT,
	HAPPYCHAT_CHAT_STATUS_MISSED,
	HAPPYCHAT_CHAT_STATUS_PENDING,
} from './constants';
import { isEnabled } from 'config';
import { isJetpackSite, getSite } from 'state/sites/selectors';
import { isATEnabled } from 'lib/automated-transfer';
import { getSectionName } from 'state/ui/selectors';
import getHappychatTimeline from 'state/happychat/selectors/get-happychat-timeline';
import getHappychatChatStatus from 'state/happychat/selectors/get-happychat-chat-status';
import isHappychatClientConnected from 'state/happychat/selectors/is-happychat-client-connected';
import getLostFocusTimestamp from 'state/happychat/selectors/get-lostfocus-timestamp';

/**
 * Grab the group or groups for happychat based on siteId
 * @param {object} state Current state
 * @param {int} siteId The site id, if no siteId is present primary siteId will be used
 * @returns {array} of groups for site Id
 */
export const getGroups = ( state, siteId ) => {
	const groups = [];

	// For Jetpack Connect we need to direct chat users to the JPOP group, to account for cases
	// when the user does not have a site yet, or their primary site is not a Jetpack site.
	if ( isEnabled( 'jetpack/happychat' ) && getSectionName( state ) === 'jetpackConnect' ) {
		groups.push( HAPPYCHAT_GROUP_JPOP );
		return groups;
	}

	const siteDetails = getSite( state, siteId );

	if ( isATEnabled( siteDetails ) ) {
		// AT sites should go to WP.com even though they are jetpack also
		groups.push( HAPPYCHAT_GROUP_WPCOM );
	} else if ( isJetpackSite( state, siteId ) ) {
		groups.push( HAPPYCHAT_GROUP_JPOP );
	} else {
		groups.push( HAPPYCHAT_GROUP_WPCOM );
	}
	return groups;
};

/**
 * Returns true if the user should be able to send messages to operators based on
 * chat status. For example new chats and ongoing chats should be able to send messages,
 * but blocked or pending chats should not.
 * @param {Object} state - global redux state
 * @return {Boolean} Whether the user is able to send messages
 */
export const canUserSendMessages = state =>
	isHappychatClientConnected( state ) &&
	! includes(
		[
			HAPPYCHAT_CHAT_STATUS_BLOCKED,
			HAPPYCHAT_CHAT_STATUS_DEFAULT,
			HAPPYCHAT_CHAT_STATUS_PENDING,
			HAPPYCHAT_CHAT_STATUS_MISSED,
			HAPPYCHAT_CHAT_STATUS_ABANDONED,
		],
		getHappychatChatStatus( state )
	);

export const hasUnreadMessages = createSelector(
	state => {
		const lastMessageTimestamp = get( last( getHappychatTimeline( state ) ), 'timestamp' );
		const lostFocusAt = getLostFocusTimestamp( state );

		return (
			typeof lastMessageTimestamp === 'number' &&
			typeof lostFocusAt === 'number' &&
			// Message timestamps are reported in seconds. We need to multiply by 1000 to convert
			// to milliseconds, so we can compare it to other JS-generated timestamps
			lastMessageTimestamp * 1000 >= lostFocusAt
		);
	},
	[ getHappychatTimeline, getLostFocusTimestamp ]
);
