import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! 👋 Soy tu asistente virtual de Hotel Manager.\n\n¿En qué puedo ayudarte hoy?\n\nEscribe **"menu"** para ver todas las opciones disponibles 😊',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Respuestas predefinidas del bot
  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Menu principal
    if (lowerMessage.includes('menu') || lowerMessage.includes('inicio') || lowerMessage.includes('opciones') || lowerMessage.includes('ayuda')) {
      return '� **Menú Principal**\n\nEscribe el número o palabra clave:\n\n1️⃣ Habitaciones - Ver tipos y precios\n2️⃣ Reservar - Proceso de reserva\n3️⃣ Servicios - Amenidades del hotel\n4️⃣ Planes - Para dueños de hoteles\n5️⃣ Contacto - Información de contacto\n6️⃣ Horarios - Check-in/Check-out\n7️⃣ Políticas - Cancelación y términos\n\nEscribe "menu" en cualquier momento para volver aquí 😊';
    }

    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('holi') || lowerMessage.includes('hey')) {
      return '¡Hola! 👋 Soy tu asistente virtual de Hotel Manager.\n\n¿En qué puedo ayudarte hoy?\n\nEscribe **"menu"** para ver todas las opciones disponibles 😊';
    }

    if (lowerMessage.includes('habitacion') || lowerMessage.includes('cuarto') || lowerMessage.includes('room') || lowerMessage === '1') {
      return '🏨 **Tipos de Habitaciones:**\n\n🛏️ **Simple** - $80/noche\n- Perfecta para 1 persona\n- Cama individual\n- WiFi, TV, Aire acondicionado\n\n🛏️🛏️ **Doble** - $120/noche\n- Ideal para parejas (2 personas)\n- Cama queen/king\n- WiFi, TV, Minibar, Vista\n\n👨‍👩‍👧‍👦 **Suite** - $200/noche\n- Lujo para familias (hasta 4 personas)\n- 2 habitaciones + sala\n- WiFi, TV, Minibar, Jacuzzi\n\nTodas incluyen desayuno buffet 🍳\n\n¿Quieres hacer una reserva? Escribe "reservar"\nEscribe "menu" para volver al inicio';
    }

    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('tarifa') || lowerMessage.includes('cuanto')) {
      return '💰 **Precios por noche:**\n\n• Habitación Simple: $80\n• Habitación Doble: $120\n• Suite Familiar: $200\n\n**🎁 Promociones actuales:**\n• 3+ noches: 10% descuento\n• 7+ noches: 15% descuento\n• Grupos 4+ habitaciones: 20% descuento\n\nTodos los precios incluyen:\n✅ Desayuno buffet\n✅ WiFi ilimitado\n✅ Estacionamiento\n✅ Acceso al gimnasio y piscina\n\n¿Te gustaría reservar? Escribe "reservar"\nEscribe "menu" para más opciones';
    }

    if (lowerMessage.includes('reserva') || lowerMessage.includes('reservar') || lowerMessage.includes('booking') || lowerMessage === '2') {
      return '📅 **Proceso de Reserva:**\n\n**Paso 1:** Crea una cuenta o inicia sesión\n- Si es tu primera vez, haz clic en "Crear Cuenta"\n- Si ya tienes cuenta, haz clic en "Iniciar Sesión"\n\n**Paso 2:** Explora hoteles\n- Navega por nuestros hoteles asociados\n- Filtra por ubicación, precio o amenidades\n\n**Paso 3:** Selecciona tu habitación\n- Elige el tipo de habitación\n- Verifica disponibilidad en el calendario\n\n**Paso 4:** Completa tu reserva\n- Ingresa fechas de entrada/salida\n- Confirma y realiza el pago\n\n**Paso 5:** ¡Listo!\n- Recibirás confirmación por email\n- Puedes modificarla desde "Mis Reservas"\n\n¿Tienes cuenta ya? Escribe "login" o "registro"\nEscribe "menu" para volver al inicio';
    }

    if (lowerMessage.includes('servicio') || lowerMessage.includes('amenidad') || lowerMessage.includes('que ofrece') || lowerMessage.includes('incluye') || lowerMessage === '3') {
      return '✨ **Servicios y Amenidades:**\n\n**Incluidos gratis:**\n✅ WiFi de alta velocidad\n✅ Piscina climatizada\n✅ Gimnasio 24/7\n✅ Estacionamiento privado\n✅ Desayuno buffet\n✅ Recepción 24/7\n\n**Servicios adicionales:**\n🍽️ Restaurant y bar\n🧖 Spa y masajes (con costo)\n🚗 Transporte al aeropuerto (con costo)\n🧺 Servicio de lavandería\n🍕 Room service 24/7\n🔒 Caja fuerte\n🌐 Business center\n\n**Seguridad:**\n🛡️ Vigilancia 24/7\n📹 Cámaras de seguridad\n🚨 Sistema de emergencias\n\n¿Quieres saber más de algún servicio específico?\nEscribe "menu" para más opciones';
    }

    if (lowerMessage.includes('plan') || lowerMessage.includes('suscri') || lowerMessage.includes('dueño') || lowerMessage === '4') {
      return '🏢 **Planes para Hoteles:**\n\n¿Tienes un hotel? ¡Únete a nuestra plataforma!\n\n💎 **Plan Básico - $29/mes**\n- Hasta 20 habitaciones\n- Gestión de reservas\n- Dashboard básico\n- Soporte por email\n\n⭐ **Plan Profesional - $79/mes** (Popular)\n- Hasta 100 habitaciones\n- Gestión completa\n- Analytics avanzados\n- Galería de imágenes\n- Soporte prioritario\n\n🚀 **Plan Enterprise - $199/mes**\n- Habitaciones ilimitadas\n- Multi-hotel\n- API completa\n- Reportes exportables\n- Soporte dedicado 24/7\n- Integraciones personalizadas\n\nTodos los planes incluyen:\n✅ Sistema de reservas online\n✅ Gestión de habitaciones\n✅ Control de usuarios\n✅ Calendario de disponibilidad\n✅ 14 días de prueba gratis\n\n¿Quieres más información? Escribe "contacto"\nEscribe "menu" para volver al inicio';
    }

    if (lowerMessage.includes('contacto') || lowerMessage.includes('telefono') || lowerMessage.includes('email') || lowerMessage.includes('llamar') || lowerMessage === '5') {
      return '📞 **Información de Contacto:**\n\n**Email:**\n✉️ info@hotelmanager.com\n📧 soporte@hotelmanager.com\n💼 ventas@hotelmanager.com\n\n**Teléfono:**\n📱 +1 (555) 123-4567\n📞 +1 (555) 123-4568 (Emergencias)\n\n**Dirección:**\n📍 Av. Principal 123, Centro\nCiudad, País\n\n**Horario de atención:**\n⏰ Lunes a Viernes: 8:00 AM - 8:00 PM\n⏰ Sábados: 9:00 AM - 6:00 PM\n⏰ Domingos: 10:00 AM - 4:00 PM\n⏰ Emergencias: 24/7\n\n**Redes sociales:**\n📘 Facebook: @HotelManager\n📷 Instagram: @hotelmanager\n🐦 Twitter: @hotel_manager\n\n¿Prefieres que te llamemos? Déjanos tu número en el formulario de contacto\nEscribe "menu" para volver al inicio';
    }

    if (lowerMessage.includes('horario') || lowerMessage.includes('check') || lowerMessage.includes('hora') || lowerMessage === '6') {
      return '🕐 **Horarios del Hotel:**\n\n**Check-in:**\n✅ Hora estándar: 3:00 PM\n🌟 Check-in temprano disponible (sujeto a disponibilidad)\n💡 Puedes solicitar early check-in al reservar\n\n**Check-out:**\n✅ Hora estándar: 12:00 PM (mediodía)\n🌟 Late check-out disponible (+$20)\n💡 Solicítalo en recepción o al reservar\n\n**Recepción:**\n✅ Abierta 24/7 todos los días\n✅ Personal multilingüe\n✅ Atención inmediata\n\n**Otros servicios:**\n🍳 Desayuno: 7:00 AM - 11:00 AM\n🍽️ Restaurant: 12:00 PM - 11:00 PM\n🍹 Bar: 5:00 PM - 2:00 AM\n🏊 Piscina: 6:00 AM - 10:00 PM\n💪 Gimnasio: 24/7\n\n**Tip:** ¡Llegando temprano? Puedes dejar tu equipaje en recepción gratis!\n\n¿Necesitas horarios especiales? Contáctanos\nEscribe "menu" para más opciones';
    }

    if (lowerMessage.includes('cancel') || lowerMessage.includes('política') || lowerMessage.includes('modificar') || lowerMessage === '7') {
      return '📋 **Políticas del Hotel:**\n\n**Cancelación gratuita:**\n✅ Hasta 24 horas antes del check-in\n✅ Reembolso completo\n✅ Sin preguntas\n\n**Cancelación con cargo:**\n⚠️ Menos de 24h antes: cargo del 50%\n⚠️ No show (no presentarse): cargo del 100%\n\n**Modificación de reserva:**\n✅ Cambio de fechas: Gratis (sujeto a disponibilidad)\n✅ Cambio de habitación: Gratis (sujeto a disponibilidad)\n✅ Agregar servicios: En cualquier momento\n\n**Políticas generales:**\n🚭 Hotel 100% libre de humo\n🐕 Mascotas: Solo en habitaciones designadas (+$25/noche)\n👶 Niños menores de 12: Gratis (misma habitación)\n🎉 Fiestas: No permitidas\n\n**Daños:**\n💰 Depósito reembolsable: $100\n🔧 Daños accidentales: Costo de reparación\n\n**Pago:**\n💳 Aceptamos: Visa, Mastercard, AmEx\n💵 Depósito requerido al reservar\n\n¿Necesitas cancelar o modificar? Ve a "Mis Reservas"\nEscribe "menu" para volver al inicio';
    }

    if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
      return '😊 ¡De nada! Fue un placer ayudarte.\n\nSi tienes más preguntas, no dudes en escribirme.\n\n**Tip:** Escribe "menu" para ver todas las opciones disponibles 📋\n\n¡Que tengas un excelente día! 🌟';
    }

    if (lowerMessage.includes('adios') || lowerMessage.includes('bye') || lowerMessage.includes('chao') || lowerMessage.includes('hasta')) {
      return '👋 ¡Hasta pronto!\n\nEspero haberte ayudado. Estoy aquí 24/7 cuando me necesites.\n\n✨ ¡Que disfrutes tu estadía!\n\n(Puedes escribirme de nuevo en cualquier momento 😊)';
    }

    if (lowerMessage.includes('login') || lowerMessage.includes('iniciar') || lowerMessage.includes('sesion')) {
      return '🔐 **Iniciar Sesión:**\n\nPara acceder a tu cuenta:\n\n1. Haz clic en el botón "Iniciar Sesión" en la parte superior\n2. Ingresa tu usuario y contraseña\n3. ¡Listo! Ya puedes hacer reservas\n\n¿Olvidaste tu contraseña?\n👉 Haz clic en "¿Olvidaste tu contraseña?" y te enviaremos un link de recuperación.\n\n¿Aún no tienes cuenta?\nEscribe "registro" para crear una\nEscribe "menu" para más opciones';
    }

    if (lowerMessage.includes('registro') || lowerMessage.includes('crear cuenta') || lowerMessage.includes('registrar')) {
      return '� **Crear Cuenta:**\n\nEs rápido y fácil:\n\n1. Haz clic en "Crear Cuenta"\n2. Completa el formulario:\n   - Nombre completo\n   - Email\n   - Contraseña segura\n   - Teléfono (opcional)\n3. Acepta términos y condiciones\n4. ¡Confirma tu email y listo!\n\n**Beneficios de tener cuenta:**\n✅ Reservas más rápidas\n✅ Historial de reservas\n✅ Ofertas exclusivas\n✅ Programa de puntos\n✅ Modificaciones fáciles\n\n¿Prefieres iniciar sesión?\nEscribe "login"\nEscribe "menu" para más opciones';
    }

    // Respuesta por defecto
    return '🤔 Hmm, no estoy seguro de cómo responder a eso.\n\nPero puedo ayudarte con muchas cosas:\n\n• Información sobre habitaciones 🏨\n• Proceso de reserva 📅\n• Servicios y amenidades ✨\n• Planes para hoteles 🏢\n• Información de contacto 📞\n• Horarios ⏰\n• Políticas de cancelación 📋\n\n**Escribe "menu"** para ver todas las opciones disponibles 😊';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular delay de respuesta del bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Sugerencias rápidas
  const quickSuggestions = [
    { icon: '📋', text: 'Ver menú', action: 'menu' },
    { icon: '🏨', text: 'Habitaciones', action: 'Quiero ver las habitaciones disponibles' },
    { icon: '📅', text: 'Reservar', action: 'Quiero hacer una reserva' },
    { icon: '📞', text: 'Contacto', action: 'Cómo puedo contactarlos?' }
  ];

  const handleSuggestion = (action) => {
    setInputMessage(action);
  };

  return (
    <>
      {/* Botón flotante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 
                     text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all z-50
                     flex items-center justify-center group"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ventana del chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                     overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Asistente Virtual</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    En línea
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full 
                                      flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm shadow-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full 
                                      flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full 
                                    flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-sm shadow-md">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions */}
                {messages.length <= 1 && (
                  <div className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sugerencias rápidas:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestion(suggestion.action)}
                          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                                   rounded-lg text-xs text-gray-700 dark:text-gray-300 transition-colors text-left"
                        >
                          {suggestion.icon} {suggestion.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                               rounded-lg hover:shadow-lg transition-all disabled:opacity-50 
                               disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
