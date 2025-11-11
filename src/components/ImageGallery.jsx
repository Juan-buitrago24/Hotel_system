import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

const ImageGallery = ({ images = [], roomNumber }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Ordenar imágenes: principal primero, luego por order
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.order - b.order;
  });

  // Fallback si no hay imágenes
  if (sortedImages.length === 0) {
    return (
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-3xl text-gray-500">🏨</span>
          </div>
          <p className="text-gray-500 font-medium">Sin imágenes</p>
          <p className="text-xs text-gray-400">Habitación {roomNumber}</p>
        </div>
      </div>
    );
  }

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Carrusel */}
      <div className="relative w-full h-48 bg-gray-900 rounded-t-xl overflow-hidden group">
        {/* Imagen actual */}
        <img
          src={sortedImages[currentIndex].url}
          alt={`Habitación ${roomNumber} - Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Overlay oscuro en hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

        {/* Badge de imagen principal */}
        {sortedImages[currentIndex].isPrimary && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            ⭐ Principal
          </div>
        )}

        {/* Botón de fullscreen */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowFullscreen(true);
          }}
          className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
          title="Ver en pantalla completa"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Botones de navegación */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              title="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              title="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicadores de posición */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {sortedImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(index, e)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                title={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador de imágenes */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-medium">
          {currentIndex + 1} / {sortedImages.length}
        </div>
      </div>

      {/* Modal Fullscreen */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-[100] flex items-center justify-center p-4">
          {/* Botón cerrar */}
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-10"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Imagen fullscreen */}
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={sortedImages[currentIndex].url}
              alt={`Habitación ${roomNumber} - Imagen ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navegación fullscreen */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-full transition-all"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-full transition-all"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Información fullscreen */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-full">
              <p className="text-sm font-medium">
                Habitación {roomNumber} • Imagen {currentIndex + 1} de {sortedImages.length}
                {sortedImages[currentIndex].isPrimary && ' • ⭐ Principal'}
              </p>
            </div>

            {/* Thumbnails en fullscreen */}
            {sortedImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto px-2 py-2 bg-black bg-opacity-50 rounded-lg">
                {sortedImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => goToImage(index, e)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex
                        ? 'ring-4 ring-white scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
