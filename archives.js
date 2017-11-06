import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { updateMessage } from '../actions/actions-index';
import { fetchArchives, restoreArchive, RESTORE_ARCHIVE } from '../actions/actions-archives';
import { showModal } from '../actions/actions-modals';

class ArchiveList extends Component {

	componentWillMount() {
		this.props.fetchArchives( this.props.store_id );
	}

	onRestoreClick( store_id, archive_id ) {
		this.props.showModal( RESTORE_ARCHIVE, { store_id, archive_id } );
	}

	render() {

		const { archives, store_id } = this.props;

        if ( 0 === archives.length ) {
            return <h4>This store currently has no Backup Archives.</h4>
        }

		const archive_list = archives.map( ( archive ) => {

			return <tr key={archive.id}>
				<td>{archive.id}</td>
				<td>{archive.created}</td>
				<td>{archive.source_id}</td>
				<td><button className="btn yellow pull-right" onClick={this.onRestoreClick.bind( this, store_id, archive.id )}>Restore</button></td>
			</tr>;
		}, this);

		return <div>
			<h3>Store Backup Archives</h3>
            <p>
                Account currently only store a single backup archive, please be aware
                that creating a new backup will overwrite the previous one.
            </p>
			<div className="table-responsive">
				<table className="table font-medium">
					<thead>
						<tr>
							<th>ID</th>
							{/*<th>Store ID</th>*/}
							<th>Date Created</th>
                            <th>Store Id</th>
							<th className="pull-right">Actions</th>
						</tr>
					</thead>
					<tbody>
					{archive_list}
					</tbody>
				</table>
			</div>
		</div>
	}
}

const mapStateToProps = (state, ownProps) => {

    const { store_id } = ownProps;
    const all_archives = state.archives;

    const archives = all_archives.filter( archive => {
        return archive.source_id === store_id
    });

	return { archives };
};

export default connect( mapStateToProps, { fetchArchives, restoreArchive, showModal } )(ArchiveList);