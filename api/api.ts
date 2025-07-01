export const API_BASE_URL = 'http://localhost:3000/api';

export const registerUser = async (userData: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    documento: number; // Cambiado a number
    rol: number;
}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al registrar usuario');
        }

        return data;
    } catch (error) {
        console.error('Error en registerUser:', error);
        throw error;
    }
};


export const verifyUser = async (email: string, code: string) => {
  try {
    console.log('URL de verificación:', `${API_BASE_URL}/auth/verify`);
    
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, code
      }),
    });

    console.log('Respuesta del servidor:', {
      status: response.status,
      statusText: response.statusText
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMsg = data.message || `Error ${response.status}: ${response.statusText}`;
      console.error('Error del servidor:', errorMsg);
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    console.error('Error completo en verifyUser:', {
      error,
      email,
      code,
      url: `${API_BASE_URL}/auth/verify`
    });
    throw error;
  }
};



export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        
        if (!response.ok) {
            const errorMessage = data.message || data.error || 'Error al iniciar sesión';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error('Error en loginUser:', error);
        throw error;
    }
};




export const updateUserProfile = async (
    userId: number, 
    userData: {
        nombre?: string;
        apellido?: string;
        documento?: number;
        password?: string;
    },
    token: string
) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar perfil');
        }

        return data;
    } catch (error) {
        console.error('Error en updateUserProfile:', error);
        throw error;
    }
};




export const getUserProfile = async (userId: number, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener perfil');
        }

        return data;
    } catch (error) {
        console.error('Error en getUserProfile:', error);
        throw error;
    }
};



export const verifyCurrentPassword = async (
  userId: number,
  currentPassword: string,
  token: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId,
        currentPassword
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al verificar contraseña');
    }

    return data.isValid;
  } catch (error) {
    console.error('Error en verifyCurrentPassword:', error);
    throw error;
  }
};



export const createEvent = async (eventData: {
  nombre: string;
  descripcion: string;
  aforo: number;
  fecha: string;
  ticketTypes: Array<{
    nombre: string;
    precio: number;
    cantidad_total: number;
    cantidad_disponible: number;
  }>;
}, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear el evento');
    }

    return data;
  } catch (error) {
    console.error('Error en createEvent:', error);
    throw error;
  }
};


export const getEvents = async (token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/eventos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener eventos');
        }

        return data;
    } catch (error) {
        console.error('Error en getEvents:', error);
        throw error;
    }
};


export const updateEvent = async (
  eventId: number,
  eventData: {
    nombre: string;
    descripcion: string;
    aforo: number;
    fecha: string;
    ticketTypes: Array<{
      id?: number;
      nombre: string;
      precio: number;
      cantidad_total: number;
      cantidad_disponible: number;
    }>;
  },
  token: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventos/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar el evento');
    }

    return data;
  } catch (error) {
    console.error('Error en updateEvent:', error);
    throw error;
  }
};


