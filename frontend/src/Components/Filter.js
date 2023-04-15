
const Filter = ({filter, handleFilterChange}) => {
    return (
        <>
        <p>filter shown with a {' '}
        <input value={filter} onChange={handleFilterChange} />
        </p>
        </>
    );
};

export default Filter;