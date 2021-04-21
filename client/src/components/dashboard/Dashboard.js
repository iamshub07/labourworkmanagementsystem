import React from 'react';
import { Link , withRouter } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

const Dashboard = props => {
    return(
        <div>
        Dashboard
        </div>
    )
}

Dashboard.propTypes = {
}

export default connect(null,{Dashboard})(Dashboard)

