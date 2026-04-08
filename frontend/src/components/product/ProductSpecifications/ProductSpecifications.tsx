import React from 'react'
import './ProductSpecifications.css'

interface ProductSpecificationsProps {
  specifications: Record<string, any>
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  return (
    <div className="ps-specifications">
      <table className="ps-table">
        <tbody>
          {Object.entries(specifications).map(([key, value]) => (
            <tr key={key} className="ps-row">
              <td className="ps-label">{key}</td>
              <td className="ps-value">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductSpecifications
