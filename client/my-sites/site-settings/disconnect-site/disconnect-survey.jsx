/** @format */
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import CompactCard from 'components/card/compact';
import QuerySitePlans from 'components/data/query-site-plans';
import SectionHeader from 'components/section-header';
import { isSiteOnPaidPlan } from 'state/selectors';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';

const DisconnectSurvey = ( { confirmHref, isPaidPlan, siteId, siteSlug, translate } ) => (
	<div className="disconnect-site__survey main">
		<QuerySitePlans siteId={ siteId } />
		<SectionHeader
			label={ translate(
				'Would you mind sharing why you want to disconnect %(siteName)s from WordPress.com?',
				{
					args: { siteName: siteSlug },
				}
			) }
		/>
		<CompactCard
			href={ `/settings/disconnect-site/too-difficult/${ siteSlug }` }
			className="disconnect-site__survey-one"
		>
			{ translate( 'It was too hard to configure Jetpack' ) }
		</CompactCard>
		<CompactCard
			href={ `/settings/disconnect-site/missing-feature/${ siteSlug }` }
			className="disconnect-site__survey-one"
		>
			{ translate( 'This plan didn’t include what I needed' ) }
		</CompactCard>
		{ isPaidPlan && (
			<CompactCard
				href={ `/settings/disconnect-site/too-expensive/${ siteSlug }` }
				className="disconnect-site__survey-one"
			>
				{ translate( 'This plan is too expensive' ) }
			</CompactCard>
		) }
		<CompactCard
			href={ confirmHref + '?reason=troubleshooting' }
			className="disconnect-site__survey-one"
		>
			{ translate( "Troubleshooting — I'll be reconnecting afterwards" ) }
		</CompactCard>
	</div>
);

DisconnectSurvey.propTypes = {
	confirmHref: PropTypes.string,
	// Provided by HOCs
	isPaidPlan: PropTypes.bool,
	siteId: PropTypes.number,
	siteSlug: PropTypes.string,
	translate: PropTypes.func,
};

export default connect( state => {
	const siteId = getSelectedSiteId( state );
	return {
		isPaidPlan: isSiteOnPaidPlan( state, siteId ),
		siteId,
		siteSlug: getSelectedSiteSlug( state ),
	};
} )( localize( DisconnectSurvey ) );
