# Seguridad de Refresh Tokens - Mejores Prácticas

## ⚠️ Problema Actual
Actualmente tienes un `ZOHO_REFRESH_TOKEN` en las variables de entorno que se usa para llamadas a la API. Esto presenta algunos riesgos de seguridad.

## 🔒 Mejores Prácticas Implementadas

### 1. **Tokens de Usuario Individual**
- Cada usuario ahora tiene su propio `refresh_token` obtenido durante el login OAuth
- Estos tokens se almacenan de forma segura en cookies HTTP-only
- Cada usuario solo puede acceder a los datos que sus permisos en Zoho permiten

### 2. **Rotación de Tokens**
- Los access tokens expiran en 1 hora
- Se renuevan automáticamente usando el refresh token del usuario
- Si falla la renovación, se requiere re-autenticación

### 3. **Separación de Responsabilidades**
```
┌─────────────────────┬─────────────────────────┐
│ Token de Aplicación │ Token de Usuario        │
├─────────────────────┼─────────────────────────┤
│ ZOHO_REFRESH_TOKEN  │ user.refresh_token      │
│ (variables entorno) │ (cookie HTTP-only)      │
├─────────────────────┼─────────────────────────┤
│ Para operaciones    │ Para operaciones        │
│ del sistema/admin   │ específicas del usuario │
│ (si se necesita)    │ (recomendado)           │
└─────────────────────┴─────────────────────────┘
```

## 🚀 Recomendaciones de Implementación

### Opción 1: Solo Tokens de Usuario (Recomendado)
```typescript
// Todas las llamadas usan el token del usuario autenticado
const session = await zohoAuth.getSession();
if (!session) throw new Error("User not authenticated");

const response = await fetch(`${zohoApiUrl}/items`, {
  headers: {
    Authorization: `Zoho-oauthtoken ${session.access_token}`,
  }
});
```

### Opción 2: Token de Aplicación para Operaciones del Sistema
```bash
# Solo para operaciones administrativas/sistema
ZOHO_APP_REFRESH_TOKEN=token_de_admin_con_permisos_limitados

# Token del usuario (manejado automáticamente)
# Se obtiene durante OAuth y se almacena en cookies
```

## 🔄 Migración de las Llamadas API Existentes

Actualmente tu código usa `getAuthToken()` que depende del refresh token en variables de entorno. Necesitas decidir:

1. **Migrar todo a tokens de usuario** (más seguro)
2. **Mantener token de aplicación solo para casos específicos**

### ¿Qué prefieres implementar?

#### A) **Solo tokens de usuario** (recomendado)
- Más seguro
- Cada usuario ve solo sus datos autorizados
- Requiere usuario autenticado para todas las operaciones

#### B) **Híbrido**
- Token de aplicación para datos públicos/sistema
- Token de usuario para operaciones específicas
- Más complejo pero más flexible

## 🛡️ Mejoras de Seguridad Adicionales

1. **Rotación de Refresh Tokens**: Zoho puede rotar refresh tokens
2. **Scope Limitado**: Solo permisos necesarios
3. **Timeout de Sesión**: Configurar tiempo límite apropiado
4. **Rate Limiting**: Implementar límites de requests
5. **Logging de Seguridad**: Auditar accesos y renovaciones

¿Cuál enfoque prefieres que implemente?
