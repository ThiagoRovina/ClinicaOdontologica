import { Col, Form, Row } from 'react-bootstrap';

function ListToolbar({
    searchValue,
    onSearchChange,
    searchPlaceholder,
    filterLabel,
    filterValue,
    onFilterChange,
    filterOptions
}) {
    return (
        <div className="toolbar-shell">
            <Row className="g-3">
                <Col md={filterOptions ? 8 : 12}>
                    <Form.Control
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder={searchPlaceholder}
                        className="toolbar-input"
                    />
                </Col>
                {filterOptions && (
                    <Col md={4}>
                        <Form.Select
                            value={filterValue}
                            onChange={(event) => onFilterChange(event.target.value)}
                            className="toolbar-input"
                            aria-label={filterLabel}
                        >
                            {filterOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                )}
            </Row>
        </div>
    );
}

export default ListToolbar;
