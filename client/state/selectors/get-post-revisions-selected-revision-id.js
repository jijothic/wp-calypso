/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';

const getPostRevisionsSelectedRevisionId = state => {
	return get( state, 'posts.revisions.selection.revisionId', 0 );
	return get( state, 'posts.revisions.selection.revisionId' );
};
export default getPostRevisionsSelectedRevisionId;
