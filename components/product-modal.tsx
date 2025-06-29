import React from 'react'
import ProductModalSub from './product-modal-sub'

interface ProductModalProps {
  product: any
  onClose: () => void
}

function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <div>
      <ProductModalSub product={product} onClose={onClose} />
      {/* You can add more content or components here as needed */}
    </div>
  )
}

export default ProductModal