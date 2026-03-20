function PageHeader({ eyebrow, title, subtitle, actions }) {
    return (
        <div className="page-header">
            <div>
                {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                <h1 className="section-title">{title}</h1>
                {subtitle && <p className="section-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header-actions">{actions}</div>}
        </div>
    );
}

export default PageHeader;
