import React from 'react';
import { Link } from 'react-router-dom';
import { User, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  product: any;
  compact?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ product, compact = false }) => {
  const metadata = product.metadata || {};
  const price = product.price || 0;
  const isFree = price === 0;

  return (
    <Link
      to={`/cours/${product.handle}`}
      className="group flex flex-col bg-white border border-black/8 hover:border-black/20 hover:shadow-lg transition-all duration-150"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <span className="text-5xl text-gold-400/25" style={{ fontFamily: 'Georgia, serif' }}>ك</span>
          </div>
        )}
        {isFree && (
          <span className="absolute top-0 right-0 px-3 py-1 text-xs font-bold bg-emerald-600 text-white uppercase tracking-wide">
            Gratuit
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 border-t-2 border-black">
        {/* Category */}
        <p className="text-xs font-bold text-gold-600 uppercase tracking-[0.12em] mb-2">
          {product.product_type || 'Cours'}{metadata.level ? ` — ${metadata.level}` : ''}
        </p>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-black leading-snug mb-3 line-clamp-2 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        {!compact && product.description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
            {product.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-black/8 flex items-center justify-between gap-3">
          {metadata.instructor && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400 min-w-0 truncate">
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              {metadata.instructor}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-bold text-gray-700 group-hover:text-black ml-auto flex-shrink-0 transition-colors">
            {isFree ? 'Accès libre' : `${(price / 100).toFixed(0)} €`}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
