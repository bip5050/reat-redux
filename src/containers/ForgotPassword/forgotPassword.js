import React, { Component } from 'react';
import {PropTypes as PT} from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';

class ForgotPasswordForm extends Component{
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
         defaultError:{
            email	:	false
         },
         isSuccess:null,
      }
      this.handleSubmit          =  this.handleSubmit.bind(this);
   }
    
   handleSubmit = (e) => {
      e.preventDefault();
      const email         =   this.email.value;
      const data          =   {
                                 email:email
                              }

    let validate	=	this.validate(data);
   if(!validate.errors.email && e.type=="submit")
      this.props.forgotPassword(data);
   }


   validate = (data) => {
		let formData	=	data || {};
		let errors		=	{...this.state.defaultError};
		let isError		=	false;
		
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

      console.log("errors",errors);
      this.setState({
         defaultError: errors
      });
		return {isError: isError, errors: errors};
   }

   validateEmail =(email) =>{
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email));
  }
  componentDidMount() {
       this.props.forgotPasswordreset(); 
  }

  componentWillReceiveProps(props) {
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
                        <h4>Recover My Password</h4>
                        <p>Enter the email address associated<br /> with your account</p>
                        <form onSubmit={this.handleSubmit}>
                           <div className="input-group">
                              <input className={`t-email ltbox ${(!!errors.email) ? ' error' : ''}`} type="text" ref={(input) => this.email = input} onChange={(e)=>this.handleSubmit(e)}  placeholder="Email address" /*defaultValue="admin"*/ />
                              {(this.props.isError) ? <div className="invalid-msg">{this.props.forgotPasswordData.message}</div> :"" }
                           </div>
                           <div className="sbtn_pan">
                              <button className="sbtn" disabled={!!this.props.isProcessing && (!!errors.email)}>{(!!this.props.isProcessing) ? 'Processing....' : 'Recover My Password'}</button>
                           </div>
                        </form>
                     </div> : 
                     <div className="aftersend">
                        <h4>Recovery Link Sent!</h4>
                        <p>Click on the link sent to <br /> your email to recover your password</p>
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
export default withRouter(ForgotPasswordForm);