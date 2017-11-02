/**
 * External dependencies
 *
 * @format
 */
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import MeSidebarNavigation from 'me/sidebar-navigation';
import NextStepsBox from './next-steps-box';
import steps from './steps';
import { getNewestSite, hasUserPurchasedAPlan } from 'state/selectors';
import {
	recordGoogleEvent as recordGoogleEventAction,
	recordTracksEvent as recordTracksEventAction,
} from 'state/analytics/actions';

class NextSteps extends React.Component {
	componentWillUnmount() {
		window.scrollTo( 0, 0 );
	}

	recordEvent = event => {
		const { isWelcome, recordGoogleEvent, recordTracksEvent } = this.props;

		recordGoogleEvent( 'Me > Next > Welcome Message', event.action );
		recordTracksEvent( 'calypso_me_next_welcome_click', {
			link: event.tracks,
			is_welcome: isWelcome,
		} );
	};

	renderMeSidebar() {
		if ( ! this.props.isWelcome ) {
			return <MeSidebarNavigation />;
		}
	}

	bloggingUniversityLinkRecordEvent = () => {
		this.recordEvent( {
			tracks: 'blogging_course',
			action: 'Clicked Blogging University Link',
		} );
	};

	docsLinkRecordEvent = () => {
		this.recordEvent( {
			tracks: 'documentation',
			action: 'Clicked Documentation Link',
		} );
	};

	dismissLinkRecordEvent = () => {
		this.recordEvent( {
			tracks: 'dismiss',
			action: 'Clicked Dismiss Link',
		} );
	};

	introMessage() {
		if ( this.props.isWelcome ) {
			return (
				<div className="next-steps__intro">
					<h3 className="next-steps__title">
						{ this.props.translate( 'Thanks for signing up for WordPress.com.' ) }
					</h3>
					<p className="next-steps__intro">
						{ this.props.translate(
							'Next you can take any of the following steps, ' +
								'join a {{bloggingUniversityLink}}guided blogging course{{/bloggingUniversityLink}}, ' +
								'or check out our {{docsLink}}support documentation{{/docsLink}}.',
							{
								components: {
									bloggingUniversityLink: (
										<a
											href="https://bloggingu.wordpress.com/"
											target="_blank"
											rel="noopener noreferrer"
											onClick={ this.bloggingUniversityLinkRecordEvent }
										/>
									),
									docsLink: (
										<a
											href="http://en.support.wordpress.com/"
											target="_blank"
											rel="noopener noreferrer"
											onClick={ this.docsLinkRecordEvent }
										/>
									),
								},
							}
						) }
					</p>
				</div>
			);
		}
	}

	outroMessage() {
		if ( this.props.isWelcome ) {
			const { newestSite } = this.props;
			const dismissLink = '/stats/insights/' + ( newestSite ? newestSite.slug : '' );

			return (
				<div className="next-steps__outro">
					<p>
						{ this.props.translate(
							'If you want you can {{a}}skip these steps{{/a}}. You can come back to this page any time.',
							{
								components: {
									a: <a href={ dismissLink } onClick={ this.dismissLinkRecordEvent } />,
								},
							}
						) }
					</p>
				</div>
			);
		}
	}

	renderSteps() {
		const { hasPlan, isWelcome, newestSite } = this.props;
		let sequence = steps.defaultSequence;

		if ( hasPlan ) {
			sequence = steps.hasPlanSequence;
		}

		return (
			<div className="next-steps__steps">
				{ sequence.map( ( stepName, index ) => {
					const step = steps.definitions( newestSite )[ stepName ];

					return (
						<NextStepsBox
							key={ stepName }
							stepName={ stepName }
							step={ step }
							primary={ index === 0 }
							isWelcome={ isWelcome }
						/>
					);
				} ) }
			</div>
		);
	}

	render() {
		const classes = classNames( 'main', 'main-column', 'next-steps', {
			'is-single-page': this.props.isWelcome,
		} );

		return (
			<div className={ classes }>
				{ this.renderMeSidebar() }

				{ this.introMessage() }

				{ this.renderSteps() }

				{ this.outroMessage() }
			</div>
		);
	}
}

export default connect(
	state => ( {
		newestSite: getNewestSite( state ),
		hasPlan: hasUserPurchasedAPlan( state ),
	} ),
	{
		recordGoogleEvent: recordGoogleEventAction,
		recordTracksEvent: recordTracksEventAction,
	}
)( localize( NextSteps ) );
