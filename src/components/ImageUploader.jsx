import { useState, useRef } from 'react';
import { Upload, X, Star, StarOff, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from './Button';

const ImageUploader = ({ roomId, images = [], onImagesUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Manejar selección de archivos
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    
    // Validar tipo y tamaño
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} supera el tamaño máximo de 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Crear previews
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // Manejar drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Remover preview
  const removePreview = (index) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // Subir imágenes
  const handleUpload = async () => {
    if (previews.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      previews.forEach(preview => {
        formData.append('images', preview.file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/images/${roomId}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al subir imágenes');
      }

      const data = await response.json();
      
      // Limpiar previews
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
      setPreviews([]);

      // Notificar actualización
      if (onImagesUpdated) {
        onImagesUpdated();
      }

      alert(`✅ ${data.images.length} imagen(es) subida(s) exitosamente`);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Eliminar imagen
  const handleDeleteImage = async (imageId) => {
    if (!confirm('¿Eliminar esta imagen?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/images/${roomId}/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar imagen');
      }

      if (onImagesUpdated) {
        onImagesUpdated();
      }

      alert('✅ Imagen eliminada');
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Establecer imagen principal
  const handleSetPrimary = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/images/${roomId}/${imageId}/primary`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al establecer imagen principal');
      }

      if (onImagesUpdated) {
        onImagesUpdated();
      }

      alert('✅ Imagen principal establecida');
    } catch (error) {
      console.error('Error:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zona de subida */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">
              Arrastra imágenes aquí
            </p>
            <p className="text-sm text-gray-500 mt-1">
              o haz clic para seleccionar archivos
            </p>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG, WebP • Máx 5MB por imagen • Hasta 5 imágenes a la vez
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Seleccionar Imágenes
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Previews de imágenes nuevas */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700">
              Imágenes listas para subir ({previews.length})
            </h3>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  previews.forEach(p => URL.revokeObjectURL(p.preview));
                  setPreviews([]);
                }}
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir {previews.length} imagen(es)
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.preview}
                  alt={preview.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 
                              text-white p-2 rounded-b-lg opacity-0 group-hover:opacity-100 
                              transition-opacity">
                  <p className="text-xs truncate">{preview.name}</p>
                  <p className="text-xs text-gray-300">{preview.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Galería de imágenes existentes */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">
            Imágenes de la habitación ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <div key={image._id} className="relative group">
                  <img
                    src={image.url}
                    alt="Habitación"
                    className={`w-full h-48 object-cover rounded-lg ${
                      image.isPrimary ? 'ring-4 ring-yellow-400' : ''
                    }`}
                  />
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 
                                  px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Principal
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 
                                group-hover:opacity-100 transition-opacity">
                    {!image.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(image._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 
                                 rounded-full transition-colors"
                        title="Establecer como principal"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1.5 
                               rounded-full transition-colors"
                      title="Eliminar imagen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {images.length === 0 && previews.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500">
            Esta habitación no tiene imágenes aún
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Sube imágenes para mostrarlas a los clientes
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
