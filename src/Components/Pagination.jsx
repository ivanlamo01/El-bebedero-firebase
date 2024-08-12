import "../styles/pagination.css";

const Pagination = ({ productsPerPage, totalProducts, currentPage, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (totalPages <= 1) return null; // No mostrar paginación si solo hay una página

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="page-link"
          >
            &laquo;
          </button>
        </li>

        {previousPage > 0 && (
          <li className="page-item">
            <button
              onClick={() => paginate(previousPage)}
              className="page-link"
            >
              {previousPage}
            </button>
          </li>
        )}

        <li className="page-item active">
          <button onClick={() => paginate(currentPage)} className="page-link">
            {currentPage}
          </button>
        </li>

        {nextPage <= totalPages && (
          <li className="page-item">
            <button
              onClick={() => paginate(nextPage)}
              className="page-link"
            >
              {nextPage}
            </button>
          </li>
        )}

        <li className="page-item">
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="page-link"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
