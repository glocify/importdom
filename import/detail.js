import React from 'react';
import Feedback from '../feedback';
import { Link } from 'react-router';
import { PATH_ROOT } from '../../routes';
import { getImportStatus } from '../../utilities/store-filters';

export default ( props ) => {

	if ( ! props.store ) {
		return <h4>Loading your store information...</h4>
	}

	const status = getImportStatus( props.store );
	const { id, type } = props.store;

	switch ( status.code ) {
		case 'in-progress':
			return <h4>{status.pretty}</h4>

		case 'deleted':
			return <h4>This store has been deleted.</h4>

		case 'migrated':
			// Checklist
			return <div className="row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

					<table className="table">
						<tbody>
							<tr className="table-success">
								<td className="col-md-1">
									<i style={{fontSize:'48px', marginTop:'25px'}} className="fa fa-check-circle-o" />
								</td>
								<td className="col-md-7"><h3>Validate</h3></td>
								<td className="col-md-4"></td>
							</tr>
							<tr>
								<td className="col-md-1">
									<i style={{fontSize:'48px', marginTop:'25px'}} className="fa fa-check-circle-o" />
								</td>
								<td className="col-md-7"><h3>Import</h3></td>
								<td className="col-md-4"></td>
							</tr>
							<tr>
								<td className="col-md-1">
									<i style={{fontSize:'48px', marginTop:'25px'}} className="fa fa-question" />
								</td>
								<td className="col-md-7"><h3>Add your Domain</h3></td>
								<td className="col-md-4">
									<Link className="btn yellow pull-right" to={ PATH_ROOT + 'domains'} >Add your domain to FSI</Link>
								</td>
							</tr>
							<tr>
								<td className="col-md-1">
									<i style={{fontSize:'48px', marginTop:'25px'}} className="fa fa-question" />
								</td>
								<td className="col-md-7"><h3>Migrate</h3></td>
								<td className="col-md-4">
									<Link className="btn yellow-casablanca pull-right" to={ PATH_ROOT + id + '/change-domain'} >Move Site to your Domain</Link>
								</td>
							</tr>
						</tbody>
					</table>

					<Link className="btn grey pull-right" to={ PATH_ROOT + 'imports/list'} >Back to Imports</Link>
				</div>
			</div>

		case 'imported':
			// Checklist

			return <div className="row">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

					<table className="table">
						<tbody>
						<tr className="table-success">
							<td className="col-md-1">
								<i style={{fontSize:'48px', marginTop:'25px'}} className="fa fa-check-circle-o" />
							</td>
							<td className="col-md-7"><h3>Validate</h3></td>
							<td className="col-md-4"></td>
						</tr>
						<tr>
							<td className="col-md-1">
								<i style={{fontSize:'48px', marginTop:'25px'}} className="fa fa-question" />
							</td>
							<td className="col-md-7">
								<h3>Import</h3>

								<strong>Important!</strong>
								<ul>
									<li>Please ensure you take full backup before using this tool</li>
									<li>We are not responsible for data loss or problems arising</li>
									<li>It is your responsibility to check the store for errors on the temporary domain before completing the import</li>
								</ul>
							</td>
							<td className="col-md-4">
								<button className="btn green pull-right" style={{marginTop:'25px'}} onClick={ props.migrate.bind( null, id ) }>Import Store</button>
							</td>
						</tr>
						<tr>
							<td className="col-md-1">
								<i style={{fontSize:'48px', marginTop:'25px'}} className="fa fa-question" />
							</td>
							<td className="col-md-7"><h3>Add your Domain</h3></td>
							<td className="col-md-4">
							</td>
						</tr>
						<tr>
							<td className="col-md-1">
								<i style={{fontSize:'48px', marginTop:'25px'}} className="fa fa-question" />
							</td>
							<td className="col-md-7"><h3>Migrate</h3></td>
							<td className="col-md-4">
							</td>
						</tr>
						</tbody>
					</table>

				</div>

				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<Feedback />
				</div>

				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<Link className="btn grey pull-right" to={ PATH_ROOT + 'imports/list'} >Back to Imports</Link>
				</div>

			</div>
	}
}