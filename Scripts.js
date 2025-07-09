// =============================================
// CONFIGURACIÓN FÁCIL PARA USUARIOS NO TÉCNICOS
// =============================================

// Duración de reproducción de videos (en segundos)
const DEFAULT_VIDEO_DURATION = 15;

// Tiempo de espera entre videos (en segundos)
const DEFAULT_POST_COOLDOWN = 10;

// =============================================
// NO MODIFICAR EL CÓDIGO A PARTIR DE ESTE PUNTO
// =============================================

document.addEventListener('widgetEvent', handleWidgetEvent);

// Expresión regular mejorada para detectar todos los formatos de YouTube
const YT_REGEX = /!videoshare\s+(?:https?:\/\/)?(?:www\.)?(?:(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})|youtube\.com\/watch\?.*\bv=([\w-]{11})|youtube\.com\/shorts\/([\w-]{11})).*?(?:[?&]t=(\d+))?/i;

let currentTimer = null;
let countdownInterval = null;
let isPlaying = false;
let isInCooldown = false;

function handleWidgetEvent(event) {
  const eventName = event.detail.event_name;
  
  if (eventName === 'chatMessageEvent') {
    if (isInCooldown) return;
    
    const message = event.detail.data.content;
    
    if (message.toLowerCase().includes('!videoshare')) {
      const videoInfo = extractYouTubeInfo(message);
      
      if (videoInfo && !isPlaying) {
        const username = event.detail.data.sender.username;
        playYouTubeVideo(videoInfo.videoId, videoInfo.startTime, username, videoInfo.isShort);
      }
    }
  }
}

// Función para convertir duración ISO 8601 a segundos
function parseISODuration(duration) {
  let totalSeconds = 0;
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const secondsMatch = duration.match(/(\d+)S/);
  
  if (hoursMatch) totalSeconds += parseInt(hoursMatch[1]) * 3600;
  if (minutesMatch) totalSeconds += parseInt(minutesMatch[1]) * 60;
  if (secondsMatch) totalSeconds += parseInt(secondsMatch[1]);
  
  return totalSeconds;
}

// Extrae ID de YouTube, tiempo de inicio y tipo de video
function extractYouTubeInfo(message) {
  const match = message.match(YT_REGEX);
  
  if (!match) return null;
  
  // Identificar el formato de URL
  let videoId;
  let isShort = false;
  
  // Detectar formato de Shorts
  if (match[3]) {
    videoId = match[3];
    isShort = true;
  } 
  // Detectar formato tradicional
  else {
    videoId = match[1] || match[2];
  }
  
  // Extraer tiempo (si existe)
  const startTime = match[4] ? parseInt(match[4]) : 0;
  
  return {
    videoId,
    startTime,
    isShort
  };
}

// Reproduce video de YouTube con tiempo personalizado
async function playYouTubeVideo(videoId, startTime = 0, username = '', isShort = false) {
  const player = document.getElementById('yt-player');
  const placeholder = document.getElementById('placeholder');
  const countdown = document.getElementById('countdown');
  const userInfo = document.getElementById('user-info');
  const usernameSpan = document.getElementById('username');
  
  stopCurrentVideo();
  
  // Obtener API key de variables de usuario
  const apiKey = 'YOUTUBE API KEY';
  // Obtener duración del video desde variables de usuario o usar valor por defecto
  let videoDuration = userVariables.video_duration?.value 
    ? parseInt(userVariables.video_duration.value) 
    : DEFAULT_VIDEO_DURATION;
  
  // Si tenemos API key, obtener duración real del video
  if (apiKey) {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const isoDuration = data.items[0].contentDetails.duration;
        const realDuration = parseISODuration(isoDuration);
        
        // Ajustar duración: usar el mínimo entre la duración real y la configurada
        videoDuration = Math.min(videoDuration, realDuration - startTime);
        
        // Asegurar que la duración no sea negativa
        if (videoDuration < 1) videoDuration = 1;
      }
    } catch (error) {
      console.error('Error obteniendo duración del video:', error);
    }
  }
  // Construir URL dependiendo del tipo de video
  let videoUrl;
  if (isShort) {
    // Formato especial para Shorts
    videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
  } else {
    // Formato tradicional para videos normales
    videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&start=${startTime}`;
  }
  
  player.src = videoUrl;
  player.style.display = 'block';
  countdown.style.display = 'flex';
  placeholder.style.opacity = '0';
  
  usernameSpan.textContent = username;
  userInfo.style.display = 'flex';
  
  setTimeout(() => {
    placeholder.style.display = 'none';
  }, 300);
  
  isPlaying = true;
  
  let secondsLeft = videoDuration;
  countdown.textContent = secondsLeft;
  
  countdownInterval = setInterval(() => {
    secondsLeft--;
    countdown.textContent = secondsLeft;
    
    if (secondsLeft <= 0) {
      stopCurrentVideo();
    }
  }, 1000);
  
  currentTimer = setTimeout(() => {
    stopCurrentVideo();
    
    // Aplicar post cooldown si está configurado
    const postCooldown = DEFAULT_POST_COOLDOWN;
      
    if (postCooldown > 0) {
      isInCooldown = true;
      setTimeout(() => {
        isInCooldown = false;
      }, postCooldown * 1000);
    }
  }, videoDuration * 1000);
}

// Detiene el video actual
function stopCurrentVideo() {
  if (!isPlaying) return;
  
  const player = document.getElementById('yt-player');
  const placeholder = document.getElementById('placeholder');
  const countdown = document.getElementById('countdown');
  const userInfo = document.getElementById('user-info');
  
  clearTimeout(currentTimer);
  clearInterval(countdownInterval);
  
  player.src = '';
  player.style.display = 'none';
  countdown.style.display = 'none';
  userInfo.style.display = 'none';
  placeholder.style.display = 'flex';
  
  setTimeout(() => {
    placeholder.style.opacity = '1';
  }, 10);
  
  isPlaying = false;
}
