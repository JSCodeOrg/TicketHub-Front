const API_BASE_URL = 'http://localhost:3000/api';

export const registerUser = async (userData: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    documento: string;
}) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
        const response = await fetch(`${API_BASE_URL}/auth/updateProfile`, {
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
