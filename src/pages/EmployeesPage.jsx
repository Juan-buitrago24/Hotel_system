import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Mail, Phone, Calendar, Search } from "lucide-react";
import { userAPI } from "../services/api";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useToast } from '../context/ToastContext';

const EmployeesManagementPage = ({ user }) => {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    role: 'empleado'
  });

  useEffect(() => {
    if (user && user.hotel) {
      loadEmployees();
    }
  }, [user]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAll();
      
      // Filtrar solo empleados (el backend ya filtra por hotel)
      const hotelEmployees = data.filter(u => u.role === 'empleado');
      
      setEmployees(hotelEmployees);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      setError(error.message || 'Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        username: employee.username,
        password: '', // No prellenar password por seguridad
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        role: 'empleado'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      role: 'empleado'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        // Actualizar empleado
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // No actualizar password si está vacío
        }
        await userAPI.update(editingEmployee._id, updateData);
        toast.success('Empleado actualizado exitosamente');
      } else {
        // Crear nuevo empleado
        await userAPI.create(formData);
        toast.success('Empleado creado exitosamente');
      }
      handleCloseModal();
      loadEmployees();
    } catch (error) {
      console.error('Error guardando empleado:', error);
      toast.error(error.response?.data?.message || 'Error al guardar empleado');
    }
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('¿Estás seguro de eliminar este empleado?')) return;
    
    try {
      await userAPI.delete(employeeId);
      toast.success('Empleado eliminado exitosamente');
      loadEmployees();
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      toast.error('Error al eliminar empleado');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Gestión de Empleados
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los empleados de tu hotel
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando empleados...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay empleados registrados</p>
            <p className="text-gray-400 text-sm mt-2">Comienza agregando tu primer empleado</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {employee.name ? employee.name[0].toUpperCase() : employee.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.role === 'empleado' ? 'Empleado' : 'Otro'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      {employee.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{employee.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      {employee.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{employee.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(employee.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(employee)}
                      className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Usuario"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={editingEmployee} // No permitir cambiar username al editar
                  />
                  
                  <InputField
                    label={editingEmployee ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña"}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingEmployee}
                  />
                  
                  <InputField
                    label="Nombre Completo"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  
                  <InputField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  
                  <InputField
                    label="Teléfono"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEmployee ? 'Actualizar' : 'Crear Empleado'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesManagementPage;
