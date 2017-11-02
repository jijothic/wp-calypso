/** @format */
/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { flow } from 'lodash';

/**
 * Internal dependencies
 */
import { recordTracksEvent } from 'state/analytics/actions';
import { getPostRevisionsSelectedRevisionId, isPostRevisionsDialogVisible } from 'state/selectors';
import { togglePostRevisionsDialog } from 'state/posts/revisions/actions';
import EditorRevisions from 'post-editor/editor-revisions';
import Dialog from 'components/dialog';
import LoadButton from 'post-editor/editor-revisions-list/load-button';

class HistoryButton extends PureComponent {
	toggleShowingDialog = () => {
		if ( ! this.props.isDialogVisible ) {
			this.props.recordTracksEvent( 'calypso_editor_post_revisions_open' );
		}
		this.props.togglePostRevisionsDialog();
	};

	render() {
		const { isDialogVisible, postId, selectedRevisionId, siteId, translate } = this.props;
		const dialogButtons = [
			{ action: 'cancel', compact: true, label: translate( 'Cancel' ) },
			<LoadButton postId={ postId } selectedRevisionId={ selectedRevisionId } siteId={ siteId } />,
		];

		return (
			<div className="editor-ground-control__history">
				<button
					className="editor-ground-control__save button is-link"
					onClick={ this.toggleShowingDialog }
				>
					{ translate( 'History' ) }
				</button>
				<Dialog
					buttons={ dialogButtons }
					className="editor-ground-control__dialog"
					isVisible={ isDialogVisible }
					onClose={ this.toggleShowingDialog }
					position="bottom"
				>
					<EditorRevisions />
				</Dialog>
			</div>
		);
	}
}

HistoryButton.PropTypes = {
	// connected to state
	isDialogVisible: PropTypes.bool.isRequired,
	selectedRevisionId: PropTypes.number,

	// connected to dispatch
	recordTracksEvent: PropTypes.func.isRequired,
	togglePostRevisionsDialog: PropTypes.func.isRequired,

	// localize
	translate: PropTypes.func,
};

export default flow(
	localize,
	connect(
		state => ( {
			isDialogVisible: isPostRevisionsDialogVisible( state ),
			selectedRevisionId: getPostRevisionsSelectedRevisionId( state ),
		} ),
		{
			recordTracksEvent,
			togglePostRevisionsDialog,
		}
	)
)( HistoryButton );
