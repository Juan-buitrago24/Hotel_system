import Room from '../models/Room.model.js';
import { cloudinary } from '../config/cloudinary.js';

// Subir múltiples imágenes a una habitación
export const uploadImages = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Verificar que la habitación existe
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Verificar que se subieron archivos
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No se subieron imágenes' });
    }

    // Preparar array de imágenes
    const newImages = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      isPrimary: room.images.length === 0 && index === 0, // Primera imagen es principal si no hay otras
      order: room.images.length + index,
      uploadedAt: new Date()
    }));

    // Agregar imágenes al array existente
    room.images.push(...newImages);
    await room.save();

    res.status(200).json({
      message: 'Imágenes subidas exitosamente',
      images: newImages,
      totalImages: room.images.length
    });
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.status(500).json({ message: 'Error al subir imágenes', error: error.message });
  }
};

// Eliminar una imagen
export const deleteImage = async (req, res) => {
  try {
    const { roomId, imageId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Encontrar la imagen
    const imageIndex = room.images.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    const image = room.images[imageIndex];

    // Eliminar de Cloudinary
    try {
      await cloudinary.uploader.destroy(image.publicId);
    } catch (cloudError) {
      console.error('Error al eliminar de Cloudinary:', cloudError);
      // Continuar aunque falle Cloudinary
    }

    // Si era la imagen principal, asignar a otra
    if (image.isPrimary && room.images.length > 1) {
      const newPrimaryIndex = imageIndex === 0 ? 1 : 0;
      room.images[newPrimaryIndex].isPrimary = true;
    }

    // Eliminar del array
    room.images.splice(imageIndex, 1);

    // Reordenar
    room.images.forEach((img, index) => {
      img.order = index;
    });

    await room.save();

    res.status(200).json({
      message: 'Imagen eliminada exitosamente',
      remainingImages: room.images.length
    });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ message: 'Error al eliminar imagen', error: error.message });
  }
};

// Establecer imagen principal
export const setPrimaryImage = async (req, res) => {
  try {
    const { roomId, imageId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Encontrar la imagen
    const image = room.images.find(img => img._id.toString() === imageId);
    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    // Quitar primary de todas las imágenes
    room.images.forEach(img => {
      img.isPrimary = false;
    });

    // Establecer la nueva imagen principal
    image.isPrimary = true;

    await room.save();

    res.status(200).json({
      message: 'Imagen principal establecida',
      primaryImage: image
    });
  } catch (error) {
    console.error('Error al establecer imagen principal:', error);
    res.status(500).json({ message: 'Error al establecer imagen principal', error: error.message });
  }
};

// Reordenar imágenes
export const reorderImages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { imageOrders } = req.body; // Array de { imageId, order }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Actualizar el orden de cada imagen
    imageOrders.forEach(({ imageId, order }) => {
      const image = room.images.find(img => img._id.toString() === imageId);
      if (image) {
        image.order = order;
      }
    });

    // Ordenar el array
    room.images.sort((a, b) => a.order - b.order);

    await room.save();

    res.status(200).json({
      message: 'Imágenes reordenadas exitosamente',
      images: room.images
    });
  } catch (error) {
    console.error('Error al reordenar imágenes:', error);
    res.status(500).json({ message: 'Error al reordenar imágenes', error: error.message });
  }
};

// Obtener imágenes de una habitación
export const getRoomImages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId).select('images');
    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Ordenar imágenes
    const sortedImages = room.images.sort((a, b) => a.order - b.order);

    res.status(200).json({
      images: sortedImages,
      totalImages: sortedImages.length
    });
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ message: 'Error al obtener imágenes', error: error.message });
  }
};
