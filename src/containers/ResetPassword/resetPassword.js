import React, { Component } from 'react';
import {PropTypes as PT} from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

class RsetpasswordForm extends Component{
   static propTypes = {
		isProcessing         :  PT.bool,
		isError              :  PT.bool,
		isSuccess            :  PT.bool,
		forgotPasswordData   :  PT.object,
		forgotPassword       :  PT.func
	}

	static defaultProps = {
		isFetching           :  false,
		isProcessing         :  false,
		isError              :  false,
		isSuccess            :  false,
		states               :  [],
		forgotPassword       :  () => {}
	}

   constructor(props){
      super(props);
      this.state          =   {
         msg             :   '',
         key             :"",
         match           : false,
         defaultError:{
            password	:	false,
            Confirmpass	:	false
         }
      }
      this.handleSubmit          =  this.handleSubmit.bind(this);
   }

   componentDidMount() {
      console.log(this.props);
     this.setState({
      key: window.location.href.split('/').slice(-2)[1]
     });
     
   }
    
   handleSubmit = (e) => {
      e.preventDefault();
     
      if(this.password.value != this.confirmpassword.value && e.type=="submit" ) {
       
            this.props.passwordnotmatch();
            return;
            
      }
      const password         =   this.password.value;
      const confirmpassword         =   this.confirmpassword.value;
      const  key             =     this.state.key;
      const data          =   {
                                password,
                                key
                              }
          if(!this.validate({password,confirmpassword}).errors.password && !this.validate({password,confirmpassword}).errors.Confirmpass && e.type=="submit"  )
      this.props.resetPassword(data);
   }

   validate = (data) => {
		let formData	=	data || {};
		let errors		=	{...this.state.defaultError};
		let isError		=	false;
		if(!!!formData.password) {
			errors.password		=	true;
			isError				=	true;
      } 
    
      else {
         errors.password		=	false;
			isError				=	false;
      }

		if(!!!formData.confirmpassword) {
			errors.Confirmpass=	true;
			isError				=	true;
      }
     
      else {
         errors.Confirmpass=	false;
			isError				=	false;
      }

      console.log("errors",errors);
      this.setState({
         defaultError: errors
      });
		return {isError: isError, errors: errors};
   }

   componentWillReceiveProps (props) {
      console.log("recive",props);
   }

   render(){
      let errors		=	{...this.state.defaultError};
      return (
         <div className="login_p">
            <div className="log_left forgot-l">               
               {
                     (!!!this.props.isSuccess) ?  
                     <div>
                        <h4>Reset Password</h4>
                        <p>Set your new password for your account</p>
                        <form onSubmit={this.handleSubmit}>
                           <div className="input-group">
                              <input className={`t-pass ltbox ${(!!errors.password) ? ' error' : ''}`}type="password" ref={(input) => this.password = input} onChange={(e)=>this.handleSubmit(e)} placeholder="New password" /*defaultValue="admin"*/ />
                           </div>
                           <div className="input-group">
                              <input className={`t-pass ltbox ${(!!errors.Confirmpass) ? ' error' : ''}`} type="password" ref={(input) => this.confirmpassword = input} onChange={(e)=>this.handleSubmit(e)} placeholder="Confirm password" /*defaultValue="admin"*/ />
                           </div>
                           <div className="sbtn_pan">
                              <button className="sbtn" disabled={!!this.props.isProcessing}>{(!!this.props.isProcessing) ? 'Processing....' : 'Reset My Password'}</button>
                           </div>
                           {this.props.isError ?  <div className="aleart_pan">
                                
                                <div className="alert_box">
                              {this.props.errMassage}
                                </div>
                                {/* <div className={`alert_box${(this.props.loginData.message === "We can't find an account with that email.") ? '' : ' hide'}`}>
                                Sorry, that email isn’t right. We can help you <Link to='/forgot-password'>recover your email address.</Link>
                                </div> */}
  
                                </div> :"" }
                             
                             
                        </form>
                     </div> : 
                     <div className="aftersend">
                        <h4>Password successfully changed!</h4>
                        <div className="sbtn_pan">
                           <Link className="sbtn" to='/login'>Back to Login</Link>
                        </div>
                     </div>
               }
            </div>
            <div className="log_right forgot-r">
               <img src="/assets/unlock.svg" alt="login_img" />
            </div>
         </div>               
      )
   }
}
export default withRouter(RsetpasswordForm);