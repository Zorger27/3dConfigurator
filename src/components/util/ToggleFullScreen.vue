<script>
import {onUnmounted} from "vue";

export default {
  name: "ToggleFullScreen",
  data() {
    return {
      isFullScreen: false,
    };
  },
  mounted() {
    // Добавляем обработчик событий клавиатуры при монтировании компонента
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener("fullscreenchange", this.handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", this.handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", this.handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", this.handleFullScreenChange);

    // Используем onUnmounted для удаления обработчика при уничтожении компонента
    onUnmounted(() => {
      document.removeEventListener('keydown', this.handleKeyPress);
      document.removeEventListener("fullscreenchange", this.handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", this.handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", this.handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", this.handleFullScreenChange);
    });
  },
  methods: {
    toggleFullScreen() {
      if (!this.isFullScreen) {
        this.enterFullScreen();
      } else {
        this.exitFullScreen();
      }
    },
    enterFullScreen() {
      const element = document.documentElement;

      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }

      this.isFullScreen = true;
    },
    handleFullScreenChange() {
      this.isFullScreen = !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      // Принудительно вызываем обновление компонента
      this.$forceUpdate();
    },

    exitFullScreen() {
      if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    },

    handleKeyPress(event) {
      // Проверяем, нажата ли клавиша Пробела или Бэкспейса
      if ((event.key === ' ' || event.key === 'Backspace') && this.isFullScreen) {
        // Вызываем ваш метод toggleFullScreen только если в режиме полноэкранного отображения
        this.toggleFullScreen();
      }
    }
  },
};
</script>

<template>
    <i @click="toggleFullScreen" title="Document Full Screen">
      <span :class="['fa', isFullScreen ? 'fa-compress-arrows-alt' : 'fa-expand-arrows-alt']"></span>
    </i>
</template>

<style scoped lang="scss">
.fa.fa-expand-arrows-alt {color: deepskyblue;}
.fa.fa-compress-arrows-alt {color: darkgoldenrod;}

@media (max-width: 768px) {
  .fa.fa-expand-arrows-alt {display: none;}
  .fa.fa-compress-arrows-alt {display: none;}
}
</style>