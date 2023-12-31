import React from 'react'
import classnames from 'classnames';
import { usePagination, DOTS } from '../usePagination.js';
import './pagination.scss';

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 2,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  // if less than 2 times in pagation range, no render
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className={classnames('pagination-container', { [className]: className })}>
      <li key={"arrow left"} className={classnames('pagination-item', { disabled: currentPage === 1})} onClick={onPrevious}>
          <div className="arrow left" />
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li key={pageNumber} className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li key={pageNumber} className={classnames('pagination-item', { selected: pageNumber === currentPage })}
              onClick={() => onPageChange(pageNumber)}>
            { pageNumber }
          </li>
        )
      })}
      <li key={"arrow right"} className={classnames('pagination-item', { disabled: currentPage === lastPage})} onClick={onNext}>
        <div className="arrow right" />
      </li>
    </ul>
  )
};

export default Pagination;