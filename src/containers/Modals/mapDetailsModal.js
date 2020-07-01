import React, { Component } from 'react';
import {
    Row,
    Col,
    Button
} from 'reactstrap';
import { Modal } from 'react-bootstrap';
import { withGoogleMap, GoogleMap, Marker, Polyline,
    DirectionsRenderer } from 'react-google-maps';
import {isEmpty, isEqual} from 'lodash';

/* function makeMarker( position, icon, title ) {
    let map = new window.google.maps.Map( element, options );
    new window.google.maps.Marker({
     position: position,
     map: map,
     icon: icon,
     title: title
    });
   }
 */
class MapDetails extends Component{
    constructor(props) {
        super(props);
        this.state              =   {
           show         :   false
        }
        this.handleClose        =   this.handleClose.bind(this);
    }

    componentWillReceiveProps(props) {
        if(!isEmpty(props.taskDetails)) {
            const directionsService = new window.google.maps.DirectionsService();

            const origin = { lat : parseFloat(props.taskDetails.mrchnt_lat), lng: parseFloat(props.taskDetails.mrchnt_lng), icon:'https://storage.googleapis.com/creative-image/order_status_icon25.png'  };
            const destination = { lat: parseFloat(props.taskDetails.recpnt_lat), lng: parseFloat(props.taskDetails.recpnt_lng), icon:'https://storage.googleapis.com/creative-image/order_status_icon25.png'  };

            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,

                    /* waypoints: [
                        {
                            location: new window.google.maps.LatLng(6.4698,  3.5852)
                        },
                        {
                            location: new window.google.maps.LatLng(6.6018,3.3515)
                        }
                    ] */
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        //console.log(result)
                        this.setState({
                            directions: result
                        });
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
        this.setState({
            show: props.show
        })
    }

    handleClose() {
        this.setState({show: false, directions: ''});
    }   
    
    shouldComponentUpdate(props, state){
        //console.log(isEqual(this.props, props), isEqual(this.state, state));
        //if(!isEqual(this.props, props) || (!isEqual(this.state, state) && !isEmpty(this.state.directions))) {
            if(!!this.state && !!this.state.directions) {
                //console.log(this.state.directions.routes[0].legs, state.directions.routes[0].legs);
                //console.log(this.state.directions.routes[0].overview_path, state.directions.routes[0].overview_path);
                //console.log(this.props, props);
                //console.log('[0].bounds : ', isEqual(this.state.directions.routes[0].bounds, state.directions.routes[0].bounds));
                //console.log('[0].legs : ', isEqual(this.state.directions.routes[0].legs, state.directions.routes[0].legs));
                //console.log('[0].warnings : ', isEqual(this.state.directions.routes[0].warnings, state.directions.routes[0].warnings));
                //console.log('[0].waypoint_order : ', isEqual(this.state.directions.routes[0].waypoint_order, state.directions.routes[0].waypoint_order));
                //console.log('[0].overview_path : ', isEqual(this.state.directions.routes[0].overview_path, state.directions.routes[0].overview_path));
                //.log('[0].bounds : ', isEqual(this.state.directions.routes[0].bounds, state.directions.routes[0].bounds));
                if(!!this.state.directions.routes[0].legs && !!this.state.directions.routes[0].overview_path)
                    return false;
            }
        //}
        return true;
    }

    render() {
        //console.log('state : ', this.state);
        let show            =   this.state.show || false;
        let taskDetails     =   this.props.taskDetails || {};
            const GoogleMapExample = withGoogleMap(props => (
                (!isEmpty(this.state.directions)) ? 
                <GoogleMap
                defaultCenter={{ lat: 6.5244, lng:  3.3792 }}
                //defaultCenter = { { lat: parseFloat(taskDetails.mrchnt_lat), lng: parseFloat(taskDetails.mrchnt_lng) } }
                defaultZoom = { 12 }
                mapTypeControl = {false}
                >
                    <DirectionsRenderer
                        directions={this.state.directions}
                        options={{
                            polylineOptions: {
                              stokeColor: "#FF0000",
                              strokeOpacity: 0.5,
                              strokeWeight: 4
                            },
                            icon: false,
                            suppressMarkers:true
                          }}
                    />
                    <Marker
                        position={{ lat: parseFloat(taskDetails.mrchnt_lat), lng: parseFloat(taskDetails.mrchnt_lng) }}
                        icon='/assets/icon01.png'
                    />
                    <Marker
                        position={{ lat: parseFloat(taskDetails.recpnt_lat), lng: parseFloat(taskDetails.recpnt_lng) }}
                        icon='/assets/icon02.png'
                    />
                    {/* <Marker position={{ lat: 38.6013835, lng: -121.39313700000002 }} /> */}
                    {/* <Polyline
                        path={[{ lat: parseFloat(taskDetails.mrchnt_lat), lng: parseFloat(taskDetails.mrchnt_lng) }, { lat: parseFloat(taskDetails.recpnt_lat), lng: parseFloat(taskDetails.recpnt_lng) }]}
                        /> */}
                </GoogleMap> : null
            ));
        return (
            <Modal size="md" className="c-modal" show={show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Map Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row noGutters>
                        <Col md="12" sm="12" className="v-map"> 
                            {
                                (!isEmpty(taskDetails)) ?
                                <GoogleMapExample
                                        containerElement={ <div style={{ height: `300px`, width: '100%' }} /> }
                                        mapElement={ <div style={{ height: `100%` }} /> }
                                /> : <div className="loader">Loading...</div>
                            }
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="map_footer">
                    <p><span>Distance:</span> {(!!this.state.directions) ? this.state.directions.routes[0].legs[0].distance.text : ''} </p>
                    <p><span>Duration:</span> {(!!this.state.directions) ? this.state.directions.routes[0].legs[0].duration.text : ''} </p>
                </Modal.Footer>
            </Modal>
        )
    }
}
export default MapDetails;