import React, { Component } from 'react';
import {PropTypes as PT} from 'prop-types';
import Config from '../config';

const range         =   (from, to, step = 1)    =>  {
    let i           =   from;
    const range     =   [];
    
    while (i <= to) {
        range.push(i);
        i += step;
    }
    return range;
}

class Pagination extends Component {
    static propTypes = {
        totalRecords    :   PT.number.isRequired,
        pageLimit       :   PT.number,
        pageNeighbours  :   PT.number,
        onPageChanged   :   PT.func
    };
    constructor(props) {
        super(props);
        const { totalRecords = null, pageLimit = Config.Pagination.itemsPerPage, pageNeighbours = 0, searchTag = '' } = props;
    
        this.pageLimit          =   typeof pageLimit === 'number' ? pageLimit : Config.Pagination.itemsPerPage;
        this.totalRecords       =   typeof totalRecords === 'number' ? totalRecords : 0;
        this.pageNeighbours     =   typeof pageNeighbours === 'number'
                                    ? Math.max(0, Math.min(pageNeighbours, 2))
                                    : 0;    
                                   
        this.totalPages         =   Math.ceil(this.totalRecords / this.pageLimit); 
        this.state              =   {
            currentPage     :   1,
            pageLimit       :   this.pageLimit,
            totalRecords    :   this.totalRecords,
            pageNeighbours  :   this.pageNeighbours,
            totalPages      :   this.totalPages,
            searchTag       :   searchTag
        };
    }

    componentDidMount() {
        this.gotoPage(1);
    }

    componentWillReceiveProps(nextProps) {
        let totalPages         =   Math.ceil(nextProps.totalRecords / nextProps.pageLimit);
        if(this.props !== nextProps){
            this.setState({
                pageLimit       :   nextProps.pageLimit,
                totalRecords    :   nextProps.totalRecords,
                pageNeighbours  :   nextProps.pageNeighbours,
                totalPages      :   totalPages
            })
            if(nextProps.totalRecords !== this.props.totalRecords)
            {
                this.gotoPage(1);
            }
        }
    }
  
    gotoPage = page => {
        const { onPageChanged = f => f }      =   this.props;
        const currentPage                     =   Math.max(0, Math.min(page, this.state.totalPages));
        
        const paginationData = {
            currentPage,
            totalPages      :   this.state.totalPages,
            pageLimit       :   this.state.pageLimit,
            totalRecords    :   this.state.totalRecords
        };
        this.setState({ currentPage }, () => onPageChanged(paginationData));
        window.scrollTo(0, 0);
    }
  
    handleClick = page => evt => {
      evt.preventDefault();
      this.gotoPage(page);
    }
  
    handleMoveLeft = evt => {
      evt.preventDefault();
      if(this.state.currentPage>1)
        this.gotoPage(this.state.currentPage - 1);
    }
  
    handleMoveRight = evt => {
      evt.preventDefault();
      if(this.state.currentPage<this.state.totalPages)
        this.gotoPage(this.state.currentPage + 1);
    }

    fetchPageNumbers = () => {
        const totalPages        =   this.state.totalPages;
        const currentPage       =   this.state.currentPage;
        const pageNeighbours    =   this.state.pageNeighbours;
        //const totalNumbers      =   (this.state.pageNeighbours * 2) + 3;
        //const totalBlocks       =   totalNumbers + 2;
        if(totalPages>4){
            let startPage           =   Math.max(1, currentPage - pageNeighbours);
            let endPage             =   startPage+4;
            if(endPage>totalPages){
                startPage           =   totalPages-4;
                endPage             =   totalPages;
            }
            let pages               =   range(startPage, endPage);
            return [...pages];
        }else{
            let pages               =   [];
            for(let i=1; i<=totalPages; i++){
                pages.push(i);
            }
            return [...pages];
        }
    }

    render(){
        //console.log('Total Records : ', this.state.totalRecords, ' Total Pages : ', this.state.totalPages);
        if (!this.state.totalRecords || this.state.totalPages === 1) return null;
        const currentPage           =   this.state.currentPage;
        const pages                 =   this.fetchPageNumbers();
        return (
            (!this.props.isProcessing) ?
            <ul className="pagination pull-right">
                {
                    this.state.totalPages > 5?
                    <li className="page-item">
                        <button className="page-link" onClick={this.handleMoveLeft}>Prev</button>
                    </li>:null
                }
                {
                    pages.map((page, index) => {
                        return (
                            <li key={index} className={`page-item${ currentPage === page ? ' active' : ''}`}>
                                <button className="page-link" onClick={ this.handleClick(page) }>{ page }</button>
                            </li>
                        )
                    })
                }
                {
                    this.state.totalPages > 5?
                    <li className="page-item">
                        <button className="page-link" onClick={this.handleMoveRight}>Next</button>
                    </li>:null
                }
            </ul>
            : null
        )
    }  
}
export default Pagination;