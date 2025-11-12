import Plan from '../models/Plan.model.js';

// Obtener todos los planes activos
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ 
      message: 'Error al obtener planes', 
      error: error.message 
    });
  }
};

// Obtener un plan por ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Error al obtener plan:', error);
    res.status(500).json({ 
      message: 'Error al obtener plan', 
      error: error.message 
    });
  }
};

// Crear un nuevo plan (solo admin)
export const createPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    
    res.status(201).json({
      message: 'Plan creado exitosamente',
      plan
    });
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(400).json({ 
      message: 'Error al crear plan', 
      error: error.message 
    });
  }
};

// Actualizar un plan (solo admin)
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }
    
    res.json({
      message: 'Plan actualizado exitosamente',
      plan
    });
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(400).json({ 
      message: 'Error al actualizar plan', 
      error: error.message 
    });
  }
};

// Eliminar (desactivar) un plan (solo admin)
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan no encontrado' });
    }
    
    res.json({
      message: 'Plan desactivado exitosamente',
      plan
    });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({ 
      message: 'Error al eliminar plan', 
      error: error.message 
    });
  }
};
