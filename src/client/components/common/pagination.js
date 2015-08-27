/**
 * Created by heipakchristine on 6/24/15.
 */

var React = require('react');
var merge = require('classnames');

//Number of pagination shown before Ellipsis
const leadingPages = 3;

var Pagination = React.createClass({
    getInitialState: function() {
        return {
            currentStartIndex: 1
        };
    },
    handlePaginationClick: function(index, totalPages){
        if (index == totalPages){

            if (totalPages <= leadingPages) {
                this._setStartIndex(1);
            } else {
                this._setStartIndex(totalPages - leadingPages);
            }
        }
        this.props.onChange(parseInt(index));
    },
    goToFirst: function(){
        this.props.onChange(parseInt(1));
        this._setStartIndex(1);
    },
    goToLast: function(totalPages, pagesShown){
        this.props.onChange(parseInt(totalPages));

        if(totalPages < (pagesShown-1)) {
            this._setStartIndex(1);
        } else {
            this._setStartIndex(totalPages - leadingPages);
        }
    },
    goToPrev: function(currentIndex, curStartIndex){
        if (currentIndex > 1) {
            this.props.onChange(parseInt(currentIndex - 1));
        }

        if (curStartIndex == currentIndex && curStartIndex > 1) {
            this._setStartIndex(currentIndex - 1);
        }
    },
    goToNext: function(currentIndex, curStartIndex, totalPages){
        if (parseInt(currentIndex + 1 - curStartIndex) > (leadingPages-1) && parseInt(currentIndex + 1) < totalPages) {
            this.props.onChange(parseInt(curStartIndex + leadingPages));
            this._setStartIndex(curStartIndex + 1);
        } else {
            if(currentIndex < totalPages) {
                this.props.onChange(currentIndex + 1);
            }
        }
    },
    handleEllipsisClick: function(curStartIndex){
        this.props.onChange(parseInt(curStartIndex + leadingPages));
        this._setStartIndex(curStartIndex + 1);
    },
    buildArray: function(startIndex, totalPages, pagesShown){

        var paginationList = [];
        var maxDisplayPage = startIndex + leadingPages;
        var endDisplayPage = totalPages - 1;

        for (var i = startIndex; i <= totalPages; i++) {

            var currentPage = this.props.currentPage;

            if (totalPages <= pagesShown) {
                paginationList.push(
                    <li className={merge({'active': i === currentPage})} onClick={this.handlePaginationClick.bind(this,parseInt(i),totalPages)}>
                        <a href="javascript:;">{i}</a>
                    </li>
                );
            } else {

                if (i < maxDisplayPage || i > endDisplayPage) {
                    paginationList.push(
                    <li className={merge({'active': i === currentPage})} onClick={this.handlePaginationClick.bind(this,parseInt(i),totalPages)}>
                         <a href="javascript:;">{i}</a>
                    </li>
                    );
                }

                if (i == maxDisplayPage && maxDisplayPage <= endDisplayPage) {
                    paginationList.push(
                        <li className="" onClick={this.handleEllipsisClick.bind(this, startIndex)}>
                             <a href="javascript:;">...</a>
                        </li>
                    );
                }
            }
        }
        return paginationList;
    },
    _setStartIndex: function(index) {
            this.setState({
                currentStartIndex: parseInt(index)
            });
    },
    render: function() {

        var totalPages = Math.ceil(parseInt(this.props.totalRecords) / parseInt(this.props.recordsPerPage));
        var curStartIndex = this.state.currentStartIndex;
        var currentIndex = this.props.currentPage;
        var pagesShown = this.props.pagesShown;
        var paginationList = this.buildArray(curStartIndex, totalPages, pagesShown);

        return(
            <ul className="pagination">
                <li onClick={this.goToFirst.bind(this)}><a href="javascript:;">&laquo;</a></li>
                <li onClick={this.goToPrev.bind(this, currentIndex, curStartIndex)}><a href="javascript:;">&lsaquo;</a></li>
                {paginationList}
                <li onClick={this.goToNext.bind(this, currentIndex, curStartIndex, totalPages)}><a href="javascript:;">&rsaquo;</a></li>
                <li onClick={this.goToLast.bind(this, totalPages, pagesShown)}><a href="javascript:;">&raquo;</a></li>
            </ul>
        );
    }
});

module.exports = Pagination;