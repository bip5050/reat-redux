import React, { Component } from 'react';
import {PropTypes as PT} from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {getCookie} from '../../util/cookies';
import {isEmpty} from 'lodash';
class LoginForm extends Component{
   static propTypes = {
		isFetching           :  PT.bool,
		isProcessing         :  PT.bool,
		isError              :  PT.bool,
		isSuccess            :  PT.bool,
		loginData            :  PT.object,
		doLogin              :  PT.func
	}

	static defaultProps = {
		isFetching           :  false,
		isProcessing         :  false,
		isError              :  false,
		isSuccess            :  false,
		states               :  [],
		doLogin              :  () => {}
	}

   constructor(props){
      super(props);
   
      this.state          =   {
         msg             :   '',
         remember: false,
         typePass: 'password',
         defaultError:{
            password	:	false,
            email	:	false
         }
      }
    //  this.handleSubmit          =  this.handleSubmit.bind(this);
      this.handleRem          =  this.handleRem.bind(this);
      this.toggleShowpass  = this.toggleShowpass.bind(this);
    
   }

   componentWillMount() {
      /* let loginData = getCookie() || {};
      console.log('Login Data : ', loginData); */
      let user          = {};
      let currentCookie = getCookie('foodjets_merchant') || {};
      user              = currentCookie || {};
     
      if(!isEmpty(user)) {
         window.location.href='/dashboard';
      }
   }

   handleRem(e) {
      let target  =    e.target;
      this.setState({
          [e.target.name]: !this.state[e.target.name],
      });
  } 



  toggleShowpass(){
      this.setState({
         typePass: this.state.typePass === 'password' ? 'text' : 'password'
      })
  }

   handleSubmit = (e) => {
      e.preventDefault();
     
     
      const email         =   this.email.value;
      const password      =   this.password.value;
      const  remember        =   this.state.remember;

      const data          =   {
                                 email:email,
                                 password:password,
                                 remember          
                              }
                            
   let validate	=	this.validate(data);
   let  type = e.type;
  
   if(!validate.errors.password && !validate.errors.email && type == "submit"  )
   this.props.doLogin(data);
     // this.props.changePassword(formData);

      
   }
   

   validate = (data) => {
		let formData	=	data || {};
		let errors		=	{...this.state.defaultError};
		let isError		=	false;
		if(!!!formData.password) {
			errors.password		=	true;
			isError				=	true;
      } 
      else if(formData.password.length<4 && formData.password.length>0) {
         errors.password		=	true;
			isError				=	true;
      }
      else {
         errors.password		=	false;
			isError				=	false;
      }
		if(!!!formData.email) {
			errors.email=	true;
			isError				=	true;
      }
      else if(!this.validateEmail(formData.email)) {
         errors.email=	true;
			isError				=	true;
      }
      else {
         errors.email=	false;
			isError				=	false;
      }

    
      this.setState({
         defaultError: errors
      });
		return {isError: isError, errors: errors};
   }

   
   validateEmail =(email) =>{
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email));
  }

   componentWillReceiveProps(props){
     
      if(!!props.isSuccess){
         window.location.href='/dashboard';
      }
   }

   render(){
      let errors		=	{...this.state.defaultError};
		//let isDisabled		=	validate.isError;
      return (
         <div className="login_p">
            <div className="log_left">
               <h4>Welcome</h4>
               <p>Sign in to your account</p>
               <form onSubmit={this.handleSubmit}>
                  <div className="input-group">
                     <input className={`t-email ltbox ${(!!errors.email) ? ' error' : ''}`} type="text" ref={(input) => this.email = input} onChange={(e)=>this.handleSubmit(e,"data")} placeholder="Email address" /*defaultValue="admin"*/ />
                  </div>
                  <div className="input-group">
                     <span className="pass_wrap"><input className={`t-pass ltbox ${(!!errors.password) ? ' error' : ''}`}type={this.state.typePass} ref={(input) => this.password = input} onChange={(e)=>this.handleSubmit(e,"data")} placeholder="Password" />
                     <Link onClick={this.toggleShowpass} className={this.state.typePass === 'text' ? "showpass":""}><img src="/assets/eye.svg" alt="eye_img" /></Link></span>
                  </div>
                  <div className="f-pass">
                     <span className="remember_pan"><input type="checkbox" id="remember" name="remember" className="c_box" checked={this.state.remember} onChange={(e)=>this.handleRem(e)}/> <label htmlFor="remember">Remember Me</label></span> <Link className="btn btn-link px-0" to='/forgot-password'>Forgot your password?</Link>
                  </div>
                  <div className="sbtn_pan">
                     <button className="sbtn" disabled={!!this.props.isProcessing}>{(!!this.props.isProcessing) ? 'Processing....' : 'Sign In'}</button>
                  </div>
                  {
                     (!!this.props.isError) ? 
                     <div className="aleart_pan">
                        <div className={`alert_box${(this.props.loginData.message === "That's not the right password. Sorry!") ? '' : ' hide'}`}>
                           {/* Sorry, that password isn’t right. We can help you <Link to='/forgot-password'>recover your password.</Link> */}
                           Sorry that email and password combination isn’t right.
                        </div>
                        <div className={`alert_box${(this.props.loginData.message === "We can't find an account with that email.") ? '' : ' hide'}`}>
                           {/* Sorry, that email isn’t right. We can help you <Link to='/forgot-password'>recover your email address.</Link> */}
                           Sorry that email and password combination isn’t right.
                        </div>
                        
                     </div> : null
                  }
               </form>
            </div>
            <div className="log_right">
               <img src="/assets/Sign-in-bg.svg" alt="login_img" />
            </div>
         </div>               
      )
   }
}
export default withRouter(LoginForm);