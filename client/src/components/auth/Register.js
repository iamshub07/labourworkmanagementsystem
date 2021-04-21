import React from 'react';
import { Fragment, useState } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import { register} from '../../actions/auth';
import PropTypes from 'prop-types'

const Register = ({setAlert,register}) => {
const [formData, setFormData] = useState({
    userid:'',
    name:'',
    email:'',
    password:'',
    designation:''
});

const { name,email,userid,password,designation } = formData;

const onChange = e => setFormData({...formData, [e.target.name]:e.target.value})

const onSubmit = async e => {
    e.preventDefault();
    console.log(userid,password,designation,name);
    if(userid && name && password && designation && email){
    register({name,userid,password,designation, email});
    }else if(userid && name && password && designation){
      register({name,userid,password,designation});
    }
    else{
      setAlert('Enter all Details','danger');
    }
}

    return(    
        <Fragment>
          <h1 className="large text-primary">Register</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
      <div className="form-group">
            <select name="designation" value={designation} onChange = {e => onChange(e)}>
            <option value="0">* Enter Designation</option>
                <option value="leader">Leader</option>
                <option value="worker">Worker</option>
                <option value="owner">Owner</option>
            </select>
            <small className="form-text"
            >Select Designation</small
          >
            </div>
      <div className="form-group">
          <input type="text" placeholder="Id" name="userid" required value={userid} onChange={e => onChange(e)} />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" required value={name} onChange={e => onChange(e)} />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email"  value={email} onChange={e => onChange(e)} />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
             value={password} onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to='/Login'>Sign In</Link>
      </p>
      </Fragment>

    )
}

Register.propTypes = {
  setAlert:PropTypes.func.isRequired,
  register:PropTypes.func.isRequired
}

export default connect(null,{setAlert, register})(Register);