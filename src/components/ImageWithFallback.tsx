import { useState, type ImgHTMLAttributes } from "react";

/**
 * Props for ImageWithFallback component
 * @extends ImgHTMLAttributes<HTMLImageElement>
 * @property {string} fallbackClassName - Optional className for fallback gradient
 */
interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

/**
 * Image component with graceful fallback to gradient on error
 *
 * Features:
 * - Automatically handles image load failures
 * - Falls back to blue-purple gradient on error
 * - Maintains provided className for consistent styling
 * - Supports all standard img attributes
 *
 * @component
 * @param {ImageWithFallbackProps} props - Component props including standard img attributes
 * @returns {JSX.Element} Image element or gradient fallback div
 *
 * @example
 * <ImageWithFallback
 *   src="https://example.com/image.jpg"
 *   alt="Description"
 *   className="w-full h-full object-cover"
 * />
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={
          fallbackClassName ||
          className ||
          "w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600"
        }
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
