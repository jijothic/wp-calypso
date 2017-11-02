/** @format */
/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';
import { flow, noop } from 'lodash';

/**
 * Internal dependencies
 */
import { isPostRevisionsDialogVisible } from 'state/selectors';
import { recordTracksEvent } from 'state/analytics/actions';
import EditorRevisions from 'post-editor/editor-revisions';
import Dialog from 'components/dialog';
import LoadButton from 'post-editor/editor-revisions-list/load-button';

class PostRevisionsDialog extends PureComponent {
	static propTypes = {
		onClose: PropTypes.func,
		postId: PropTypes.number,
		siteId: PropTypes.number,

		// connected to state
		isVisible: PropTypes.func.isRequired,
		selectedRevisionId: PropTypes.number,

		// connected to dispatch
		recordTracksEvent: PropTypes.func.isRequired,

		// localize
		translate: PropTypes.func.isRequired,
	};

	static defaultProps = {
		onClose: noop,
	};

	componentDidMount() {
		this.props.recordTracksEvent( 'calypso_editor_post_revisions_open' );
	}

	render() {
		const { isVisible, onClose, postId, selectedRevisionId, siteId, translate } = this.props;
		const dialogButtons = [
			{ action: 'cancel', compact: true, label: translate( 'Cancel' ) },
			<LoadButton postId={ postId } selectedRevisionId={ selectedRevisionId } siteId={ siteId } />,
		];

		return (
			<Dialog
				buttons={ dialogButtons }
				className="editor-revisions__dialog"
				isVisible={ isVisible }
				onClose={ onClose }
			>
				<EditorRevisions />
			</Dialog>
		);
	}
}

export default flow(
	localize,
	connect(
		state => {
			return {
				isVisible: isPostRevisionsDialogVisible( state ),
			};
		},
		{ recordTracksEvent }
	)
)( PostRevisionsDialog );
