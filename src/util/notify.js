import $ from 'jquery';
import '../css/notify.css';

export const success = (text) =>{
	$('#notify').fadeIn('slow');
	//notify.show(text, 'success', 5000, successCss);
	$('#notify').removeClass('inform').removeClass('error').removeClass('warning').addClass('success');
	$('#notify').html(text.message);
	setTimeout(function(){
		$('#notify').fadeOut('slow')
	}, 5000);
};

export const error = (text) =>{
	$('#notify').fadeIn('slow');
	$('#notify').removeClass('inform').removeClass('success').removeClass('warning').addClass('error');
	$('#notify').html(text.message);
	setTimeout(function(){
		$('#notify').fadeOut('slow')
	}, 5000);
};

export const warning = (text) =>{
	$('#notify').fadeIn('slow');
	$('#notify').removeClass('inform').removeClass('success').removeClass('error').addClass('warning');
	$('#notify').html(text.message);
	setTimeout(function(){
		$('#notify').fadeOut('slow')
	}, 5000);
};

export const inform = (text) =>{
	$('#notify').fadeIn('slow');
	$('#notify').removeClass('error').removeClass('warning').removeClass('success').addClass('inform');
	$('#notify').html(text.message);
	setTimeout(function(){
		$('#notify').fadeOut('slow')
	}, 5000);
};