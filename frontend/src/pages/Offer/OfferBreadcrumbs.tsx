// frontend/src/pages/Offer/OfferBreadcrumbs.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import './OfferBreadcrumbs.css'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface OfferBreadcrumbsProps {
  items: BreadcrumbItem[]
}

const OfferBreadcrumbs: React.FC<OfferBreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="ofr-breadcrumbs">
      <div className="ofr-breadcrumbs-container">
        <Link to="/" className="ofr-breadcrumb-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </Link>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="ofr-breadcrumb-separator" size={16} />
            {item.path ? (
              <Link to={item.path} className="ofr-breadcrumb-item">
                {item.label}
              </Link>
            ) : (
              <span className="ofr-breadcrumb-item ofr-breadcrumb-current">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  )
}

export default OfferBreadcrumbs
