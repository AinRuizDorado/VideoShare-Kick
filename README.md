# YouTube Video Share Widget for Kick

## Descripción

Este widget permite a los espectadores compartir videos de YouTube en el chat de Kick usando el comando !videoshare. Cuando un usuario envía un enlace válido de YouTube con este comando, el widget reproduce automáticamente el video durante 15 segundos en la transmisión, con opción para iniciar en un tiempo específico.
## Características principales

- Reproduce videos de YouTube directamente en el stream.
- Soporta múltiples formatos de URLs de YouTube.
- Permite especificar tiempo de inicio (ej: `?t=10` para comenzar en el segundo 10).
- Interfaz limpia con cuenta regresiva visible.
- Personalizable mediante variables de usuario.
- Se reinicia automáticamente después de 15 segundos.

Instalación en KickBot

1. Accede al Widget Builder de KickBot
2. Crea un nuevo widget personalizado
3. Copia y pega los siguientes códigos en sus respectivas secciones:


Formatos de comando válidos

El widget reconoce los siguientes formatos de comandos:

### Formato básico:
```text
!videoshare https://youtu.be/aHWX_h7Wv2I
!videoshare https://www.youtube.com/watch?v=aHWX_h7Wv2I
```

### Con tiempo específico:
```text
!videoshare https://youtu.be/aHWX_h7Wv2I?t=10
!videoshare https://www.youtube.com/watch?v=aHWX_h7Wv2I&t=15
```

### Con texto adicional:
```text
Mira este clip: !videoshare https://youtu.be/aHWX_h7Wv2I?t=5 Es increíble!
```

### Con parámetros adicionales:
```text
!videoshare https://www.youtube.com/watch?feature=share&v=aHWX_h7Wv2I&t=20
```

Personalización

Puedes personalizar el widget mediante variables de usuario:

- `bg_color`: Color de fondo del widget (valor predeterminado: `#0e0e10`)
- `text_color`: Color del texto (valor predeterminado: `#efeff1`)
- `placeholder_bg`: Color de fondo del placeholder (valor predeterminado: `#18181b`)
- `countdown_bg`: Color de fondo de la cuenta regresiva (valor predeterminado: `rgba(0, 0, 0, 0.7)`)

## Notas importantes

- El video se reproduce durante exactamente 15 segundos.
- Solo se reproduce un video a la vez.
- Los videos se reproducen automáticamente con sonido.
- Requiere que los espectadores usen el comando `!videoshare` antes del enlace.
- El widget es compatible con todos los formatos comunes de enlaces de YouTube.
