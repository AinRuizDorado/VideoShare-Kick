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

const REWARD_NAME = "VIDEOSHARE";
const YT_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})|youtube\.com\/watch\?.*\bv=([\w-]{11}))(?:\?|\&)?(?:t=(\d+))?/i;

let currentTimer = null;
let countdownInterval = null;
let isPlaying = false;
let isInCooldown = false;

function handleWidgetEvent(event) {
  const eventName = event.detail.event_name;
  
  // Detectar eventos de recompensa
  if (eventName === 'rewardEvent') {
    const rewardName = event.detail.data.reward_name;
    const rewardInput = event.detail.data.user_input || "";
    
    if (rewardName === REWARD_NAME && !isInCooldown) {
      const videoInfo = extractYouTubeInfo(rewardInput);
      
      if (videoInfo && !isPlaying) {
        const username = event.detail.data.username;
        playYouTubeVideo(videoInfo.videoId, videoInfo.startTime, username);
      }
    }
  }
}

function extractYouTubeInfo(input) {
  const match = input.match(YT_REGEX);
  
  if (!match) return null;
  
  const videoId = match[1] || match[2];
  const startTime = match[3] ? parseInt(match[3]) : 0;
  
  return {
    videoId,
    startTime
  };
}

function playYouTubeVideo(videoId, startTime = 0, username = '') {
  const player = document.getElementById('yt-player');
  const placeholder = document.getElementById('placeholder');
  const countdown = document.getElementById('countdown');
  const userInfo = document.getElementById('user-info');
  const usernameSpan = document.getElementById('username');
  
  stopCurrentVideo();
  
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&start=${startTime}`;
  player.style.display = 'block';
  countdown.style.display = 'flex';
  placeholder.style.opacity = '0';
  
  usernameSpan.textContent = username;
  userInfo.style.display = 'block';
  
  setTimeout(() => {
    placeholder.style.display = 'none';
  }, 300);
  
  isPlaying = true;
  
  // Obtener duración del video desde variables de usuario o usar valor por defecto
  const videoDuration = userVariables.video_duration?.value 
    ? parseInt(userVariables.video_duration.value) 
    : DEFAULT_VIDEO_DURATION;
    
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
    
    // Obtener cooldown desde variables de usuario o usar valor por defecto
    const postCooldown = userVariables.post_cooldown?.value 
      ? parseInt(userVariables.post_cooldown.value) 
      : DEFAULT_POST_COOLDOWN;
      
    if (postCooldown > 0) {
      isInCooldown = true;
      setTimeout(() => {
        isInCooldown = false;
      }, postCooldown * 1000);
    }
  }, videoDuration * 1000);
}

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

if (globalValues.streamerInfo) {
  document.documentElement.style.setProperty(
    '--bg-color', 
    userVariables.bg_color.value || '#0e0e10'
  );
}
