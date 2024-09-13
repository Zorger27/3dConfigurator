<script>
import {onUnmounted} from "vue";

export default {
  name: "CanvasFullScreen",
  props: {
    canvasContainer: Object,
  },
  mounted() {
    window.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });
    onUnmounted(() => {
      window.removeEventListener('keydown', this.handleKeyDown);
    });
  },
  methods: {
    handleKeyDown(event) {
      if ((event.key === 'Backspace' || event.key === ' ') && document.fullscreenElement) {
        document.exitFullscreen().catch((error) => {
          console.error('Exit fullscreen error:', error.message);
        });
      }
    },
    fullScreenView() {
      const canvasContainerElement = this.canvasContainer;

      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        if (canvasContainerElement.requestFullscreen) {
          canvasContainerElement.requestFullscreen();
        } else if (canvasContainerElement.mozRequestFullScreen) { // Firefox
          canvasContainerElement.mozRequestFullScreen();
        } else if (canvasContainerElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
          canvasContainerElement.webkitRequestFullscreen();
        } else if (canvasContainerElement.msRequestFullscreen) { // IE/Edge
          canvasContainerElement.msRequestFullscreen();
        }
      }
    },
  },

}
</script>

<template>
    <i @click="fullScreenView" title="Canvas Full Screen">
      <span :class="['fa', 'fa-expand']"></span>
    </i>
</template>

<style scoped lang="scss">
.fa.fa-expand {color: mediumvioletred;}

@media (max-width: 768px) {
  .fa.fa-expand {display: none;}
}
</style>