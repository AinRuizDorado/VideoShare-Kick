// JavaScript
document.addEventListener('widgetEvent', handleWidgetEvent);

// Nueva expresión regular mejorada
const YT_REGEX = /!videoshare\s+(?:https?:\/\/)?(?:www\.)?(?:(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})|youtube\.com\/watch\?.*\bv=([\w-]{11}))(?:\?|\&)?(?:t=(\d+))?/i;

let currentTimer = null;
let countdownInterval = null;
let isPlaying = false;

// Handle events from KickBot
function handleWidgetEvent(event) {
  const eventName = event.detail.event_name;
  
  if (eventName === 'chatMessageEvent') {
    const message = event.detail.data.content;
    
    // Verificar si el mensaje contiene el comando !videoshare
    if (message.toLowerCase().includes('!videoshare')) {
      const videoInfo = extractYouTubeInfo(message);
      
      if (videoInfo && !isPlaying) {
        playYouTubeVideo(videoInfo.videoId, videoInfo.startTime);
      }
    }
  }
}

// Extrae ID de YouTube y tiempo de inicio
function extractYouTubeInfo(message) {
  const match = message.match(YT_REGEX);
  
  if (!match) return null;
  
  // Extraer video ID (de cualquiera de los dos posibles grupos)
  const videoId = match[1] || match[2];
  // Extraer tiempo (si existe) o usar 0 por defecto
  const startTime = match[3] ? parseInt(match[3]) : 0;
  
  return {
    videoId,
    startTime
  };
}

// Reproduce video de YouTube con tiempo personalizado
function playYouTubeVideo(videoId, startTime = 0) {
  const player = document.getElementById('yt-player');
  const placeholder = document.getElementById('placeholder');
  const countdown = document.getElementById('countdown');
  
  // Detener cualquier video actual
  stopCurrentVideo();
  
  // Construir URL con tiempo personalizado
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&start=${startTime}`;
  
  // Mostrar reproductor
  player.style.display = 'block';
  countdown.style.display = 'flex';
  placeholder.style.opacity = '0';
  
  // Ocultar placeholder después de la transición
  setTimeout(() => {
    placeholder.style.display = 'none';
  }, 300);
  
  isPlaying = true;
  
  // Iniciar cuenta regresiva
  let secondsLeft = 15;
  countdown.textContent = secondsLeft;
  
  countdownInterval = setInterval(() => {
    secondsLeft--;
    countdown.textContent = secondsLeft;
    
    if (secondsLeft <= 0) {
      stopCurrentVideo();
    }
  }, 1000);
  
  // Detener después de 15 segundos
  currentTimer = setTimeout(stopCurrentVideo, 15000);
}

// Detiene el video actual
function stopCurrentVideo() {
  if (!isPlaying) return;
  
  const player = document.getElementById('yt-player');
  const placeholder = document.getElementById('placeholder');
  const countdown = document.getElementById('countdown');
  
  // Limpiar temporizadores
  clearTimeout(currentTimer);
  clearInterval(countdownInterval);
  
  // Reiniciar reproductor
  player.src = '';
  player.style.display = 'none';
  
  // Restaurar UI
  countdown.style.display = 'none';
  placeholder.style.display = 'flex';
  
  setTimeout(() => {
    placeholder.style.opacity = '1';
  }, 10);
  
  isPlaying = false;
}

// Inicializar con valores globales
if (globalValues.streamerInfo) {
  document.documentElement.style.setProperty(
    '--bg-color', 
    userVariables.bg_color.value || '#0e0e10'
  );
}
