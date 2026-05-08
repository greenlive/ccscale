'use client'

interface ProductDetailImagesProps {
  images: string[]  // detailImages URLs (JSON parsed array)
  productName?: string
}

export function ProductDetailImages({
  images,
}: ProductDetailImagesProps) {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="w-[750px] max-w-full mx-auto">
      {images.map((imageUrl, index) => (
        <div
          key={index}
          className="relative overflow-hidden bg-gray-100"
          style={{ width: 750, maxHeight: 2500 }}
        >
          <img
            src={imageUrl}
            alt={`Product detail image ${index + 1}`}
            className="w-full h-auto"
            style={{ maxHeight: 2500 }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}
